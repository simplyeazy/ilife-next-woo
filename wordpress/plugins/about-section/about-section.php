<?php
/**
 * Plugin Name: iLife About Section
 * Description: Manage the homepage About section via the Options API. No CPT overhead.
 * Version: 1.0.0
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 * Plugin URI: https://lundy.dev
 */

if (!defined('ABSPATH')) exit;

const ILIFE_ABOUT_OPTION_KEY = 'ilife_about_section';
const ILIFE_ABOUT_SECTION_PERMISSION = 'manage_ilife_about_section';

/**
 * On activation, grant the capability to Administrators.
 */
register_activation_hook(__FILE__, 'ilife_about_activate');
function ilife_about_activate() {
    $admin = get_role('administrator');
    if ($admin && !$admin->has_cap(ILIFE_ABOUT_SECTION_PERMISSION)) {
        $admin->add_cap(ILIFE_ABOUT_SECTION_PERMISSION);
    }
}

/**
 * On deactivation, remove the capability from Administrators.
 */
register_deactivation_hook(__FILE__, 'ilife_about_deactivate');
function ilife_about_deactivate() {
    $admin = get_role('administrator');
    if ($admin) {
        $admin->remove_cap(ILIFE_ABOUT_SECTION_PERMISSION);
    }
}

/**
 * Return the default content structure.
 */
function ilife_about_defaults() {
    return [
        'title'           => 'Tentang kami',
        'subtitle'        => '',
        'paragraph_1'     => '',
        'paragraph_2'     => '',
        'highlights'      => [],
        'button_text'     => 'Pelajari lebih lanjut',
        'button_url'      => '/tentang-kami',
    ];
}

/**
 * Get the saved about data, merged with defaults.
 */
function ilife_get_about_data() {
    return wp_parse_args(
        get_option(ILIFE_ABOUT_OPTION_KEY, []),
        ilife_about_defaults()
    );
}

// ────────────────────────────────
// Admin page (protected by custom cap)
// ────────────────────────────────
add_action('admin_menu', function () {
    add_menu_page(
        'About Section',
        'About Section',
        ILIFE_ABOUT_SECTION_PERMISSION,          // ← custom capability
        'ilife-about',
        'ilife_about_admin_page',
        'dashicons-info',
        31
    );
});

function ilife_about_admin_page() {
    // Extra security check inside the callback
    if (!current_user_can(ILIFE_ABOUT_SECTION_PERMISSION)) {
        wp_die(__('Sorry, you are not allowed to access this page.'));
    }

    // Save logic
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        check_admin_referer('ilife_about_settings');

        $highlights = [];
        if (!empty($_POST['highlights']) && is_array($_POST['highlights'])) {
            foreach ($_POST['highlights'] as $h) {
                $clean = sanitize_text_field($h);
                if ($clean !== '') {
                    $highlights[] = $clean;
                }
            }
        }

        update_option(ILIFE_ABOUT_OPTION_KEY, [
            'title'       => sanitize_text_field($_POST['title'] ?? ''),
            'subtitle'    => sanitize_text_field($_POST['subtitle'] ?? ''),
            'paragraph_1' => wp_kses_post($_POST['paragraph_1'] ?? ''),
            'paragraph_2' => wp_kses_post($_POST['paragraph_2'] ?? ''),
            'highlights'  => $highlights,
            'button_text' => sanitize_text_field($_POST['button_text'] ?? ''),
            'button_url'  => esc_url_raw($_POST['button_url'] ?? ''),
        ]);

        echo '<div class="notice notice-success"><p>About section saved.</p></div>';
    }

    $data = ilife_get_about_data();
    ?>
    <div class="wrap">
        <h1>Edit Homepage About Section</h1>
        <form method="post">
            <?php wp_nonce_field('ilife_about_settings'); ?>

            <table class="form-table">
                <tr>
                    <th><label for="ilife-title">Section Heading</label></th>
                    <td>
                        <input type="text" name="title" id="ilife-title"
                               value="<?php echo esc_attr($data['title']); ?>"
                               class="regular-text" />
                    </td>
                </tr>
                <tr>
                    <th><label for="ilife-subtitle">Subtitle (optional)</label></th>
                    <td>
                        <input type="text" name="subtitle" id="ilife-subtitle"
                               value="<?php echo esc_attr($data['subtitle']); ?>"
                               class="regular-text" />
                    </td>
                </tr>
                <tr>
                    <th><label for="ilife-paragraph-1">First Paragraph</label></th>
                    <td>
                        <textarea name="paragraph_1" id="ilife-paragraph-1"
                                  rows="5" class="large-text"><?php echo esc_textarea($data['paragraph_1']); ?></textarea>
                        <p class="description">Shown on the right side (first paragraph).</p>
                    </td>
                </tr>
                <tr>
                    <th><label for="ilife-paragraph-2">Second Paragraph</label></th>
                    <td>
                        <textarea name="paragraph_2" id="ilife-paragraph-2"
                                  rows="5" class="large-text"><?php echo esc_textarea($data['paragraph_2']); ?></textarea>
                        <p class="description">Shown on the right side (second paragraph).</p>
                    </td>
                </tr>
                <tr>
                    <th>Highlights (checkpoints)</th>
                    <td>
                        <div id="ilife-highlights-container">
                            <?php
                            $highlights = $data['highlights'];
                            if (empty($highlights)) {
                                $highlights = [''];
                            }
                            foreach ($highlights as $index => $text) :
                            ?>
                                <div class="ilife-highlight-row" style="margin-bottom:8px;">
                                    <input type="text" name="highlights[]"
                                           value="<?php echo esc_attr($text); ?>"
                                           class="regular-text" />
                                    <button type="button" class="button ilife-remove-highlight">Remove</button>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <button type="button" class="button" id="ilife-add-highlight">Add Highlight</button>
                        <p class="description">Add as many or as few bullet points as you like.</p>
                    </td>
                </tr>
                <tr>
                    <th><label for="ilife-button-text">Button Text</label></th>
                    <td>
                        <input type="text" name="button_text" id="ilife-button-text"
                               value="<?php echo esc_attr($data['button_text']); ?>"
                               class="regular-text" />
                    </td>
                </tr>
                <tr>
                    <th><label for="ilife-button-url">Button URL</label></th>
                    <td>
                        <input type="text" name="button_url" id="ilife-button-url"
                               value="<?php echo esc_url($data['button_url']); ?>"
                               class="regular-text" />
                        <p class="description">Default: /tentang-kami</p>
                    </td>
                </tr>
            </table>

            <?php submit_button(); ?>
        </form>
    </div>

    <!-- inline script for add/remove highlights -->
    <script>
    jQuery(function($) {
        $('#ilife-add-highlight').on('click', function(e) {
            e.preventDefault();
            var row = $('<div class="ilife-highlight-row" style="margin-bottom:8px;">' +
                '<input type="text" name="highlights[]" class="regular-text" />' +
                '<button type="button" class="button ilife-remove-highlight">Remove</button>' +
                '</div>');
            $('#ilife-highlights-container').append(row);
        });

        $('#ilife-highlights-container').on('click', '.ilife-remove-highlight', function(e) {
            e.preventDefault();
            $(this).closest('.ilife-highlight-row').remove();
        });
    });
    </script>
    <?php
}

// ────────────────────────────────
// REST API endpoint (public – read only)
// ────────────────────────────────
add_action('rest_api_init', function () {
    register_rest_route('ilife/v1', '/about', [
        'methods'             => 'GET',
        'callback'            => function () {
            return ilife_get_about_data();
        },
        'permission_callback' => '__return_true',
    ]);
});