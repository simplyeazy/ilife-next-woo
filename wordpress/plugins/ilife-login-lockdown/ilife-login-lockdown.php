<?php
/**
 * Plugin Name: iLife Login Lockdown
 * Description: Locks an IP address after a configurable number of failed wp-admin login attempts.
 * Version:     1.0.0
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return the real client IP, taking common proxy headers into account.
 * We deliberately avoid X-Forwarded-For spoofing by only trusting it when
 * the connecting IP is a known private/loopback range.
 */
function login_lockdown_get_ip(): string {
    $remote = $_SERVER['REMOTE_ADDR'] ?? '';

    // Trust proxy headers only from localhost / private ranges (Docker gateway etc.)
    $is_private = filter_var(
        $remote,
        FILTER_VALIDATE_IP,
        FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
    ) === false;

    if ( $is_private ) {
        foreach ( [ 'HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR' ] as $header ) {
            if ( ! empty( $_SERVER[ $header ] ) ) {
                $ip = trim( explode( ',', $_SERVER[ $header ] )[0] );
                if ( filter_var( $ip, FILTER_VALIDATE_IP ) ) {
                    return $ip;
                }
            }
        }
    }

    return $remote;
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
        $data = [ 'count' => 0, 'locked' => false ];
    }

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
            // Reverse-lookup IP is not stored, so we show the hash and attempt count
            $lockouts[] = [
                'key'        => str_replace( '_transient_lld_', '', $row['option_name'] ),
                'count'      => $data['count'] ?? '?',
                'locked_at'  => isset( $data['locked_at'] ) ? gmdate( 'Y-m-d H:i:s', $data['locked_at'] ) . ' UTC' : 'unknown',
            ];
        }
    }
    ?>
    <div class="wrap">
        <h1>Login Lockdown</h1>
        <p>
            Max attempts: <strong><?php echo esc_html( LOGIN_LOCKDOWN_MAX_ATTEMPTS ); ?></strong> &nbsp;|&nbsp;
            Window: <strong><?php echo esc_html( LOGIN_LOCKDOWN_WINDOW_SECONDS ); ?>s</strong> &nbsp;|&nbsp;
            Lockout duration: <strong><?php echo esc_html( (int) ceil( LOGIN_LOCKDOWN_DURATION_SECONDS / 60 ) ); ?> min</strong>
        </p>

        <?php if ( empty( $lockouts ) ) : ?>
            <p>No active lockouts.</p>
        <?php else : ?>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th>IP hash (md5)</th>
                        <th>Failed attempts</th>
                        <th>Locked at</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ( $lockouts as $lockout ) : ?>
                    <tr>
                        <td><?php echo esc_html( $lockout['key'] ); ?></td>
                        <td><?php echo esc_html( $lockout['count'] ); ?></td>
                        <td><?php echo esc_html( $lockout['locked_at'] ); ?></td>
                        <td>
                            <form method="post">
                                <?php wp_nonce_field( 'lld_unlock', 'lld_nonce' ); ?>
                                <input type="hidden" name="lld_unlock_ip" value="<?php echo esc_attr( $lockout['key'] ); ?>">
                                <button class="button button-secondary" type="submit">Unlock</button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>

        <hr>
        <h2>Override defaults in wp-config.php</h2>
        <pre style="background:#f0f0f0;padding:12px;border-radius:4px">define( 'LOGIN_LOCKDOWN_MAX_ATTEMPTS',      5    ); // failures before lockout
define( 'LOGIN_LOCKDOWN_WINDOW_SECONDS',   300  ); // rolling window (seconds)
define( 'LOGIN_LOCKDOWN_DURATION_SECONDS', 1800 ); // lockout duration (seconds)</pre>
    </div>
    <?php
}
