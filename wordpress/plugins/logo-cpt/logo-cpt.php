<?php
/**
 * Plugin Name: iLife Logo
 * Description: Registers the 'logo' CPT so the site logo can be managed from WordPress. Assign dedicated logo assets for the frontend, wp-admin, and WordPress CMS branding.
 * Version: 1.1.0
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 * Plugin URI: https://lundy.dev
 */

if (!defined('ABSPATH')) exit;

const ILIFE_LOGO_FRONTEND_META_KEY = '_ilife_logo_frontend_id';
const ILIFE_LOGO_ADMIN_META_KEY = '_ilife_logo_admin_id';
const ILIFE_LOGO_CMS_META_KEY = '_ilife_logo_cms_id';

function ilife_logo_fields()
{
    return [
        'frontend' => [
            'meta_key' => ILIFE_LOGO_FRONTEND_META_KEY,
            'label' => 'Frontend Logo',
            'description' => 'Used by the headless Next.js frontend. Use your landscape logo here.',
        ],
        'admin' => [
            'meta_key' => ILIFE_LOGO_ADMIN_META_KEY,
            'label' => 'WP Admin Logo',
            'description' => 'Used on the WordPress login screen. Use your landscape admin logo here.',
        ],
        'cms' => [
            'meta_key' => ILIFE_LOGO_CMS_META_KEY,
            'label' => 'WordPress CMS Icon',
            'description' => 'Used as the WordPress admin favicon and toolbar icon. Use the simplified vertical mark here.',
        ],
    ];
}

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
        'id' => $attachment_id,
        'src' => $src,
        'alt' => $alt,
    ];
}

function ilife_get_active_logo_post_id()
{
    $posts = get_posts([
        'post_type' => 'logo',
        'post_status' => 'publish',
        'posts_per_page' => 1,
        'orderby' => 'date',
        'order' => 'DESC',
        'fields' => 'ids',
        'no_found_rows' => true,
    ]);

    return isset($posts[0]) ? (int) $posts[0] : 0;
}

function ilife_get_active_logo_asset($role)
{
    $fields = ilife_logo_fields();
    if (!isset($fields[$role])) {
        return null;
    }

    $post_id = ilife_get_active_logo_post_id();
    if (!$post_id) {
        return null;
    }

    $attachment_id = (int) get_post_meta($post_id, $fields[$role]['meta_key'], true);
    if ($attachment_id) {
        $asset = ilife_get_logo_attachment_payload($attachment_id);
        if ($asset) {
            return $asset;
        }
    }

    if ($role === 'frontend') {
        $fallback_id = get_post_thumbnail_id($post_id);
        if ($fallback_id) {
            return ilife_get_logo_attachment_payload($fallback_id);
        }
    }

    return null;
}

add_action('init', function () {
    register_post_type('logo', [
        'labels'       => [
            'name'          => 'Logo',
            'singular_name' => 'Logo',
            'add_new_item'  => 'Add New Logo',
            'edit_item'     => 'Edit Logo',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_rest' => true,
        'rest_base'    => 'logo',
        'supports'     => ['title', 'thumbnail'],
        'menu_icon'    => 'dashicons-format-image',
        'description'  => 'Assign dedicated logo assets for frontend, wp-admin, and WordPress CMS branding. By lundy.dev',
    ]);

    foreach (ilife_logo_fields() as $field) {
        register_post_meta('logo', $field['meta_key'], [
            'single' => true,
            'type' => 'integer',
            'default' => 0,
            'show_in_rest' => false,
            'sanitize_callback' => 'absint',
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }

    register_rest_field('logo', 'logo_roles', [
        'get_callback' => function ($post_arr) {
            $post_id = isset($post_arr['id']) ? (int) $post_arr['id'] : 0;
            if (!$post_id) {
                return null;
            }

            $roles = [];
            foreach (ilife_logo_fields() as $role => $field) {
                $roles[$role] = ilife_get_logo_attachment_payload(
                    (int) get_post_meta($post_id, $field['meta_key'], true)
                );
            }

            return $roles;
        },
        'schema' => [
            'description' => 'Role-based logo assets for frontend and WordPress admin branding.',
            'type' => 'object',
            'context' => ['view', 'edit'],
            'readonly' => true,
        ],
    ]);
});

add_action('add_meta_boxes', function () {
    add_meta_box(
        'ilife-logo-roles',
        'Logo Assignments',
        function ($post) {
            wp_nonce_field('ilife_logo_roles_save', 'ilife_logo_roles_nonce');
            ?>
            <p>Select which uploaded image should be used in each part of the system. The most recently published Logo entry is treated as the active one.</p>
            <div class="ilife-logo-fields">
                <?php foreach (ilife_logo_fields() as $role => $field) :
                    $attachment_id = (int) get_post_meta($post->ID, $field['meta_key'], true);
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
            <p><strong>Compatibility note:</strong> the featured image is still used as a fallback frontend logo if the Frontend Logo field is empty.</p>
            <?php
        },
        'logo',
        'normal',
        'default'
    );
});

add_action('admin_enqueue_scripts', function ($hook) {
    if (!in_array($hook, ['post.php', 'post-new.php'], true)) {
        return;
    }

    $screen = get_current_screen();
    if (!$screen || $screen->post_type !== 'logo') {
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

add_action('save_post_logo', function ($post_id) {
    if (!isset($_POST['ilife_logo_roles_nonce']) || !wp_verify_nonce($_POST['ilife_logo_roles_nonce'], 'ilife_logo_roles_save')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $submitted = isset($_POST['ilife_logo_roles']) && is_array($_POST['ilife_logo_roles'])
        ? $_POST['ilife_logo_roles']
        : [];

    foreach (ilife_logo_fields() as $role => $field) {
        $attachment_id = isset($submitted[$role]) ? absint($submitted[$role]) : 0;

        if ($attachment_id) {
            update_post_meta($post_id, $field['meta_key'], $attachment_id);
        } else {
            delete_post_meta($post_id, $field['meta_key']);
        }
    }
});

add_action('login_head', function () {
    $admin_logo = ilife_get_active_logo_asset('admin');
    $cms_icon = ilife_get_active_logo_asset('cms');

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
