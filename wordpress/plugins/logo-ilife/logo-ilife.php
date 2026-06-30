<?php
/**
 * Plugin Name: iLife Logo
 * Description: Registers site‑wide logo assets so branding can be managed from WordPress. 
 * Assign dedicated logos for the frontend, wp‑admin, and WordPress CMS.
 * Require `manage_ilife_logo` permission for non administrator
 * Version: 1.0.1
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 * Plugin URI: https://lundy.dev
 */

if (!defined('ABSPATH')) exit;

const ILIFE_LOGO_OPTION_KEY = 'ilife_logo_assets';
const ILIFE_LOGO_PERMISSION = 'manage_ilife_logo';

/**
 * On plugin activation, grant the capability to the Administrator role
 */
register_activation_hook(__FILE__, 'ilife_logo_activate');
function ilife_logo_activate() {
    $admin = get_role('administrator');
    if ($admin && !$admin->has_cap(ILIFE_LOGO_PERMISSION)) {
        $admin->add_cap(ILIFE_LOGO_PERMISSION);
    }
}

/**
 * Optional: clean up on deactivation if you want
 */
register_deactivation_hook(__FILE__, 'ilife_logo_deactivate');
function ilife_logo_deactivate() {
    $admin = get_role('administrator');
    if ($admin) {
        $admin->remove_cap(ILIFE_LOGO_PERMISSION);
    }
}

/**
 * Return the field definitions for the three logo roles.
 */
function ilife_logo_fields()
{
    return [
        'frontend' => [
            'label'       => 'Frontend Logo',
            'description' => 'Used by the headless Next.js frontend. Use your landscape logo here.',
        ],
        'admin'    => [
            'label'       => 'WP Admin Logo',
            'description' => 'Used on the WordPress login screen. Use your landscape admin logo here.',
        ],
        'cms'      => [
            'label'       => 'WordPress CMS Icon',
            'description' => 'Used as the WordPress admin favicon and toolbar icon. Use the simplified vertical mark here.',
        ],
    ];
}

/**
 * Convert an attachment ID into a clean array (id, src, alt).
 */
function ilife_get_logo_attachment_payload($attachment_id)
{
    $attachment_id = absint($attachment_id);
    if (!$attachment_id) {
        return null;
    }

    $src = wp_get_attachment_image_url($attachment_id, 'full');
    if (!$src) {
        return null;
    }

    $alt = trim((string) get_post_meta($attachment_id, '_wp_attachment_image_alt', true));
    if ($alt === '') {
        $alt = get_the_title($attachment_id) ?: 'Logo';
    }

    return [
        'id'  => $attachment_id,
        'src' => $src,
        'alt' => $alt,
    ];
}

/**
 * Get the currently saved logo assets (or defaults).
 */
function ilife_get_logo_assets()
{
    return wp_parse_args(
        get_option(ILIFE_LOGO_OPTION_KEY, []),
        [
            'frontend' => 0,
            'admin'    => 0,
            'cms'      => 0,
        ]
    );
}

/**
 * Retrieve a single logo asset payload for the given role.
 */
function ilife_get_active_logo_asset($role)
{
    $fields = ilife_logo_fields();
    if (!isset($fields[$role])) {
        return null;
    }

    $assets = ilife_get_logo_assets();
    $attachment_id = absint($assets[$role] ?? 0);
    if ($attachment_id) {
        return ilife_get_logo_attachment_payload($attachment_id);
    }

    return null;
}

// -------------------------------------------------------------------------
// Admin page
// -------------------------------------------------------------------------
add_action('admin_menu', function () {
    add_menu_page(
        'iLife Logo',
        'iLife Logo',
        'manage_options',
        'ilife-logo',
        'ilife_logo_admin_page',
        'dashicons-format-image',
        31
    );
});

function ilife_logo_admin_page()
{
    // Save logic
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        check_admin_referer('ilife_logo_settings');
        $updated = [];
        foreach (array_keys(ilife_logo_fields()) as $role) {
            $updated[$role] = isset($_POST['ilife_logo_roles'][$role])
                ? absint($_POST['ilife_logo_roles'][$role])
                : 0;
        }
        update_option(ILIFE_LOGO_OPTION_KEY, $updated);
        echo '<div class="notice notice-success"><p>Logo assignments saved.</p></div>';
    }

    $assets = ilife_get_logo_assets();
    ?>
    <div class="wrap">
        <h1>iLife Logo</h1>
        <form method="post">
            <?php wp_nonce_field('ilife_logo_settings'); ?>
            <p>Select which uploaded image should be used in each part of the system.</p>
            <div class="ilife-logo-fields">
                <?php foreach (ilife_logo_fields() as $role => $field) :
                    $attachment_id = absint($assets[$role]);
                    $image = ilife_get_logo_attachment_payload($attachment_id);
                    ?>
                    <div class="ilife-logo-field" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #dcdcde;">
                        <h3 style="margin: 0 0 8px;"><?php echo esc_html($field['label']); ?></h3>
                        <p style="margin: 0 0 12px;"><?php echo esc_html($field['description']); ?></p>
                        <input
                            type="hidden"
                            name="ilife_logo_roles[<?php echo esc_attr($role); ?>]"
                            value="<?php echo esc_attr($attachment_id); ?>"
                            class="ilife-logo-input"
                            data-role="<?php echo esc_attr($role); ?>"
                        />
                        <div class="ilife-logo-preview" data-role="<?php echo esc_attr($role); ?>" style="margin-bottom: 12px;">
                            <?php if ($image) : ?>
                                <img src="<?php echo esc_url($image['src']); ?>" alt="" style="max-width: 240px; height: auto; display: block;" />
                            <?php else : ?>
                                <em>No image selected.</em>
                            <?php endif; ?>
                        </div>
                        <button type="button" class="button ilife-logo-select" data-role="<?php echo esc_attr($role); ?>">
                            <?php echo $image ? 'Change image' : 'Select image'; ?>
                        </button>
                        <button type="button" class="button-link-delete ilife-logo-remove" data-role="<?php echo esc_attr($role); ?>" <?php disabled(!$image); ?>>
                            Remove image
                        </button>
                    </div>
                <?php endforeach; ?>
            </div>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Enqueue media scripts on our admin page only
add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_ilife-logo') {
        return;
    }

    wp_enqueue_media();
    wp_add_inline_script('jquery-core', <<<'JS'
jQuery(function ($) {
    const frames = {};

    function setPreview(role, image) {
        const preview = $('.ilife-logo-preview[data-role="' + role + '"]');
        const input = $('.ilife-logo-input[data-role="' + role + '"]');
        const removeButton = $('.ilife-logo-remove[data-role="' + role + '"]');
        const selectButton = $('.ilife-logo-select[data-role="' + role + '"]');

        if (image) {
            preview.html('<img src="' + image.url + '" alt="" style="max-width: 240px; height: auto; display: block;" />');
            input.val(image.id);
            removeButton.prop('disabled', false);
            selectButton.text('Change image');
            return;
        }

        preview.html('<em>No image selected.</em>');
        input.val('');
        removeButton.prop('disabled', true);
        selectButton.text('Select image');
    }

    $('.ilife-logo-select').on('click', function (event) {
        event.preventDefault();

        const role = $(this).data('role');
        if (frames[role]) {
            frames[role].open();
            return;
        }

        frames[role] = wp.media({
            title: 'Select logo image',
            button: { text: 'Use this image' },
            library: { type: 'image' },
            multiple: false,
        });

        frames[role].on('select', function () {
            const attachment = frames[role].state().get('selection').first().toJSON();
            setPreview(role, attachment);
        });

        frames[role].open();
    });

    $('.ilife-logo-remove').on('click', function (event) {
        event.preventDefault();
        setPreview($(this).data('role'), null);
    });
});
JS
    );
});

// -------------------------------------------------------------------------
// REST API endpoint for the Next.js frontend
// -------------------------------------------------------------------------
add_action('rest_api_init', function () {
    register_rest_route('ilife/v1', '/logo', [
        'methods'             => 'GET',
        'callback'            => function () {
            $result = [];
            foreach (array_keys(ilife_logo_fields()) as $role) {
                $result[$role] = ilife_get_active_logo_asset($role);
            }
            return $result;
        },
        'permission_callback' => '__return_true',
    ]);
});

// -------------------------------------------------------------------------
// WordPress login screen branding
// -------------------------------------------------------------------------
add_action('login_head', function () {
    $admin_logo = ilife_get_active_logo_asset('admin');
    $cms_icon   = ilife_get_active_logo_asset('cms');

    if ($admin_logo) {
        ?>
        <style>
            #login h1 a {
                background-image: url('<?php echo esc_url($admin_logo['src']); ?>');
                background-size: contain;
                width: min(320px, 100%);
                height: 96px;
            }
        </style>
        <?php
    }

    if ($cms_icon) {
        printf(
            '<link rel="icon" href="%1$s" sizes="32x32" />' . "\n" . '<link rel="apple-touch-icon" href="%1$s" />' . "\n",
            esc_url($cms_icon['src'])
        );
    }
});

add_filter('login_headerurl', function () {
    return home_url('/');
});

add_filter('login_headertext', function () {
    return get_bloginfo('name');
});

// -------------------------------------------------------------------------
// WordPress admin bar & favicon branding
// -------------------------------------------------------------------------
add_action('admin_head', function () {
    $cms_icon = ilife_get_active_logo_asset('cms');
    if (!$cms_icon) {
        return;
    }

    printf(
        '<link rel="icon" href="%1$s" sizes="32x32" />' . "\n" . '<link rel="apple-touch-icon" href="%1$s" />' . "\n",
        esc_url($cms_icon['src'])
    );
    ?>
    <style>
        #wpadminbar #wp-admin-bar-wp-logo > .ab-item .ab-icon {
            background-image: url('<?php echo esc_url($cms_icon['src']); ?>');
            background-position: center;
            background-repeat: no-repeat;
            background-size: 18px 18px;
        }

        #wpadminbar #wp-admin-bar-wp-logo > .ab-item .ab-icon::before {
            content: '';
        }
    </style>
    <?php
});