<?php
/**
 * Plugin Name: iLife Login Lockdown
 * Description: Locks an IP address after a configurable number of failed wp-admin login attempts. Also blocks user enumeration via REST API, disables XML-RPC, and blocks system.multicall abuse.
 * Version:     1.1.0
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 * Requires PHP: 7.4
 * Requires at least: 5.6
 *
 * == Overrides to WordPress core ==
 *
 * 1. REST API user enumeration (wp/v2/users)
 *    - Why: WordPress exposes all usernames via /wp-json/wp/v2/users by default.
 *      This allows attackers to discover valid usernames (e.g. 'admin') for
 *      targeted brute force attacks. Blocking this endpoint for unauthenticated
 *      requests prevents user enumeration.
 *    - How: hooks into `rest_endpoints` filter, removes /wp/v2/users endpoints
 *      when the request is not from a logged-in user.
 *
 * 2. XML-RPC disabled
 *    - Why: XML-RPC (xmlrpc.php) is a legacy protocol that is commonly abused
 *      for brute force attacks (especially via system.multicall which batches
 *      hundreds of password guesses in a single request). It also enables
 *      distributed denial-of-service attacks (pingback DDoS).
 *    - How: hooks into `xmlrpc_enabled` filter to return false, and explicitly
 *      blocks direct access to xmlrpc.php via wp_die() on `plugins_loaded` hook.
 *
 * 3. system.multicall blocked
 *    - Why: Even though XML-RPC is disabled globally, a defense-in-depth measure
 *      to explicitly remove the system.multicall method. This prevents any
 *      future code path that might re-enable XML-RPC selectively from being
 *      exploited for batched brute force.
 *    - How: hooks into `xmlrpc_methods` filter to unset 'system.multicall'.
 */

defined( 'ABSPATH' ) || exit;

// ---------------------------------------------------------------------------
// Configuration — change these constants or override via wp-config.php
// ---------------------------------------------------------------------------
if ( ! defined( 'LOGIN_LOCKDOWN_MAX_ATTEMPTS' ) ) {
    define( 'LOGIN_LOCKDOWN_MAX_ATTEMPTS', 5 );       // failures before lockout
}
if ( ! defined( 'LOGIN_LOCKDOWN_WINDOW_SECONDS' ) ) {
    define( 'LOGIN_LOCKDOWN_WINDOW_SECONDS', 300 );   // 5-minute rolling window
}
if ( ! defined( 'LOGIN_LOCKDOWN_DURATION_SECONDS' ) ) {
    define( 'LOGIN_LOCKDOWN_DURATION_SECONDS', 1800 ); // 30-minute lockout
}

// -- Feature flags (all enabled by default) ---------------------------------
if ( ! defined( 'LOGIN_LOCKDOWN_BLOCK_REST_USERS' ) ) {
    define( 'LOGIN_LOCKDOWN_BLOCK_REST_USERS', true );  // Block /wp/v2/users for guests
}
if ( ! defined( 'LOGIN_LOCKDOWN_DISABLE_XMLRPC' ) ) {
    define( 'LOGIN_LOCKDOWN_DISABLE_XMLRPC', true );    // Disable xmlrpc.php entirely
}
if ( ! defined( 'LOGIN_LOCKDOWN_BLOCK_MULTICALL' ) ) {
    define( 'LOGIN_LOCKDOWN_BLOCK_MULTICALL', true );   // Remove system.multicall method
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return the real client IP, taking Hostinger hCDN and other proxy headers into account.
 *
 * Hostinger's hCDN sends requests from their edge servers (public IPs).
 * We check CDN/proxy headers unconditionally:
 * 1. HTTP_CF_CONNECTING_IP (Cloudflare)
 * 2. HTTP_X_FORWARDED_FOR (general proxy / CDN, first IP is the client)
 * 3. HTTP_X_REAL_IP (nginx realip)
 * 4. REMOTE_ADDR (fallback — may be CDN edge IP)
 */
function login_lockdown_get_ip(): string {
    // Check CDN/proxy headers in order of precedence
    $proxy_headers = [
        'HTTP_CF_CONNECTING_IP', // Cloudflare
        'HTTP_X_FORWARDED_FOR',  // General proxy / CDN (first IP is the real client)
        'HTTP_X_REAL_IP',        // nginx realip
    ];

    foreach ( $proxy_headers as $header ) {
        if ( ! empty( $_SERVER[ $header ] ) ) {
            $ip = trim( explode( ',', $_SERVER[ $header ] )[0] );
            if ( filter_var( $ip, FILTER_VALIDATE_IP ) ) {
                return $ip;
            }
        }
    }

    return $_SERVER['REMOTE_ADDR'] ?? '';
}

function login_lockdown_transient_key( string $ip ): string {
    return 'lld_' . md5( $ip );
}

function login_lockdown_is_locked( string $ip ): bool {
    $key  = login_lockdown_transient_key( $ip );
    $data = get_transient( $key );
    if ( ! $data ) {
        return false;
    }
    return isset( $data['locked'] ) && $data['locked'] === true;
}

function login_lockdown_record_failure( string $ip ): void {
    $key  = login_lockdown_transient_key( $ip );
    $data = get_transient( $key );

    if ( ! $data ) {
        $data = [ 'count' => 0, 'locked' => false, 'ip' => $ip ];
    }

    // Ensure IP is stored so admin page can display it
    $data['ip'] = $ip;

    // Reset counter if the rolling window has expired
    if ( isset( $data['last_failure'] ) &&
         ( time() - $data['last_failure'] ) > LOGIN_LOCKDOWN_WINDOW_SECONDS ) {
        $data['count'] = 0;
        $data['locked'] = false;
    }

    $data['count']++;
    $data['last_failure'] = time();

    if ( $data['count'] >= LOGIN_LOCKDOWN_MAX_ATTEMPTS ) {
        $data['locked']    = true;
        $data['locked_at'] = time();
        set_transient( $key, $data, LOGIN_LOCKDOWN_DURATION_SECONDS );
        login_lockdown_log( $ip, $data['count'] );
    } else {
        // Keep entry alive across the rolling window
        set_transient( $key, $data, LOGIN_LOCKDOWN_WINDOW_SECONDS );
    }
}

function login_lockdown_log( string $ip, int $attempts ): void {
    if ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
        // phpcs:ignore WordPress.PHP.DevelopmentFunctions
        error_log( sprintf(
            '[Login Lockdown] IP %s locked after %d failed attempts.',
            $ip,
            $attempts
        ) );
    }
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Block locked IPs before authentication proceeds.
 * Priority 1 ensures this fires before any other authenticate filter.
 */
add_filter( 'authenticate', function ( $user, $username ) {
    $ip = login_lockdown_get_ip();
    if ( login_lockdown_is_locked( $ip ) ) {
        $minutes = (int) ceil( LOGIN_LOCKDOWN_DURATION_SECONDS / 60 );
        return new WP_Error(
            'login_lockdown',
            sprintf(
                '<strong>ERROR:</strong> Your IP has been locked due to too many failed login attempts. Please try again in %d minutes.',
                $minutes
            )
        );
    }
    return $user;
}, 1, 2 );

/**
 * Record a failure. WordPress fires this AFTER a bad username or password.
 */
add_action( 'wp_login_failed', function ( $username ) {
    $ip = login_lockdown_get_ip();
    if ( ! login_lockdown_is_locked( $ip ) ) {
        login_lockdown_record_failure( $ip );
    }
} );

// ---------------------------------------------------------------------------
// Additional Security Overrides
// ---------------------------------------------------------------------------

/**
 * Block REST API user enumeration for unauthenticated requests.
 *
 * WordPress exposes /wp/v2/users by default, leaking all usernames.
 * This filter removes those endpoints for anyone not logged in.
 */
if ( LOGIN_LOCKDOWN_BLOCK_REST_USERS ) {
    add_filter( 'rest_endpoints', function ( $endpoints ) {
        if ( ! is_user_logged_in() ) {
            if ( isset( $endpoints['/wp/v2/users'] ) ) {
                unset( $endpoints['/wp/v2/users'] );
            }
            if ( isset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] ) ) {
                unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
            }
        }
        return $endpoints;
    }, 999 );
}

/**
 * Disable XML-RPC entirely.
 *
 * XML-RPC is a legacy protocol that is frequently abused for
 * brute force attacks (especially system.multicall batching)
 * and pingback DDoS amplification.
 */
if ( LOGIN_LOCKDOWN_DISABLE_XMLRPC ) {
    add_filter( 'xmlrpc_enabled', '__return_false' );

    // Also block direct access to xmlrpc.php at the server level.
    // Use 'plugins_loaded' (not 'init') because XML-RPC bootstraps before 'init' fires.
    add_action( 'plugins_loaded', function () {
        if ( defined( 'XMLRPC_REQUEST' ) && XMLRPC_REQUEST ) {
            wp_die(
                'XML-RPC is disabled for security reasons.',
                'XML-RPC Disabled',
                [ 'response' => 403 ]
            );
        }
    }, 0 );
}

/**
 * Block system.multicall XML-RPC method.
 *
 * Defense-in-depth: even if XML-RPC is re-enabled somehow,
 * this prevents the most common brute-force bypass technique
 * where hundreds of password guesses are sent in a single request.
 */
if ( LOGIN_LOCKDOWN_BLOCK_MULTICALL ) {
    add_filter( 'xmlrpc_methods', function ( $methods ) {
        unset( $methods['system.multicall'] );
        return $methods;
    }, 999 );
}

// ---------------------------------------------------------------------------
// Admin menu — view and clear lockouts
// ---------------------------------------------------------------------------

add_action( 'admin_menu', function () {
    add_options_page(
        'Login Lockdown',
        'Login Lockdown',
        'manage_options',
        'login-lockdown',
        'login_lockdown_admin_page'
    );
} );

function login_lockdown_admin_page(): void {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    // Handle unlock action
    if ( isset( $_POST['lld_unlock_ip'], $_POST['lld_nonce'] ) &&
         wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['lld_nonce'] ) ), 'lld_unlock' ) ) {
        $ip  = sanitize_text_field( wp_unslash( $_POST['lld_unlock_ip'] ) );
        $key = login_lockdown_transient_key( $ip );
        delete_transient( $key );
        echo '<div class="notice notice-success"><p>IP <strong>' . esc_html( $ip ) . '</strong> has been unlocked.</p></div>';
    }

    // Scan all transient keys (WordPress stores them in options table)
    global $wpdb;
    $rows = $wpdb->get_results(
        "SELECT option_name, option_value FROM {$wpdb->options}
         WHERE option_name LIKE '_transient_lld_%'
         ORDER BY option_name",
        ARRAY_A
    );

    $lockouts = [];
    foreach ( $rows as $row ) {
        $data = maybe_unserialize( $row['option_value'] );
        if ( is_array( $data ) && ! empty( $data['locked'] ) ) {
            $lockouts[] = [
                'ip'        => $data['ip'] ?? '(unknown — stored with older version)',
                'hash'      => str_replace( '_transient_lld_', '', $row['option_name'] ),
                'count'     => $data['count'] ?? '?',
                'locked_at' => isset( $data['locked_at'] ) ? gmdate( 'Y-m-d H:i:s', $data['locked_at'] ) . ' UTC' : 'unknown',
                'is_hash'   => empty( $data['ip'] ),
            ];
        }
    }
    ?>
    <div class="wrap">
        <h1>Login Lockdown</h1>
        <h2 style="margin-top:0.5em">Protected by overrides</h2>
        <ul>
            <li>🔒 <?php echo LOGIN_LOCKDOWN_BLOCK_REST_USERS ? '✔' : '✘'; ?> REST API users endpoint blocked</li>
            <li>🔒 <?php echo LOGIN_LOCKDOWN_DISABLE_XMLRPC ? '✔' : '✘'; ?> XML-RPC disabled</li>
            <li>🔒 <?php echo LOGIN_LOCKDOWN_BLOCK_MULTICALL ? '✔' : '✘'; ?> system.multicall blocked</li>
        </ul>
        <p>
            Max attempts: <strong><?php echo esc_html( LOGIN_LOCKDOWN_MAX_ATTEMPTS ); ?></strong> &nbsp;|&nbsp;
            Window: <strong><?php echo esc_html( LOGIN_LOCKDOWN_WINDOW_SECONDS ); ?>s</strong> &nbsp;|&nbsp;
            Lockout duration: <strong><?php echo esc_html( (int) ceil( LOGIN_LOCKDOWN_DURATION_SECONDS / 60 ) ); ?> min</strong>
        </p>

        <table class="widefat striped">
            <thead>
                <tr>
                    <th>IP address</th>
                    <th>Failed attempts</th>
                    <th>Locked at</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty( $lockouts ) ) : ?>
                    <tr><td colspan="4">No active lockouts.</td></tr>
                <?php else : ?>
                    <?php foreach ( $lockouts as $lockout ) : ?>
                    <tr>
                        <td>
                            <?php if ( $lockout['is_hash'] ) : ?>
                                <code><?php echo esc_html( $lockout['hash'] ); ?></code> (hash — stored by older version)
                            <?php else : ?>
                                <code><?php echo esc_html( $lockout['ip'] ); ?></code>
                            <?php endif; ?>
                        </td>
                        <td><?php echo esc_html( $lockout['count'] ); ?></td>
                        <td><?php echo esc_html( $lockout['locked_at'] ); ?></td>
                        <td>
                            <form method="post">
                                <?php wp_nonce_field( 'lld_unlock', 'lld_nonce' ); ?>
                                <input type="hidden" name="lld_unlock_ip" value="<?php echo esc_attr( $lockout['hash'] ); ?>">
                                <button class="button button-secondary" type="submit">Unlock</button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
        <?php endif; ?>
            </tbody>
        </table>

        <hr>
        <h2>Override defaults in wp-config.php</h2>
        <pre style="background:#f0f0f0;padding:12px;border-radius:4px">define( 'LOGIN_LOCKDOWN_MAX_ATTEMPTS',      5    ); // failures before lockout
define( 'LOGIN_LOCKDOWN_WINDOW_SECONDS',   300  ); // rolling window (seconds)
define( 'LOGIN_LOCKDOWN_DURATION_SECONDS', 1800 ); // lockout duration (seconds)
define( 'LOGIN_LOCKDOWN_BLOCK_REST_USERS', true ); // Block wp/v2/users for guests
define( 'LOGIN_LOCKDOWN_DISABLE_XMLRPC',   true ); // Disable xmlrpc.php
define( 'LOGIN_LOCKDOWN_BLOCK_MULTICALL',  true ); // Block system.multicall</pre>
    </div>
    <?php
}
