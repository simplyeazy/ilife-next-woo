<?php
/**
 * Plugin Name: iLife Hero Slides
 * Description: Registers the 'slides' CPT with WooCommerce product picker and video support
 * Version: 1.2.0
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 */
if (!defined('ABSPATH')) exit;

add_action('init', function () {
    register_post_type('slides', [
        'labels'       => ['name' => 'Hero Slides', 'singular_name' => 'Slide'],
        'public'       => false,
        'show_ui'      => true,
        'show_in_rest' => true,
        'rest_base'    => 'slides',
        'supports'     => ['title', 'excerpt', 'thumbnail', 'page-attributes', 'custom-fields'],
        'menu_icon'    => 'dashicons-images-alt2',
    ]);
});

// Register all meta fields
add_action('init', function () {
    $fields = [
        'cta_text'        => ['default' => 'Lihat Produk'],
        'cta_url'         => ['default' => '/shop'],
        'cta_product_id'  => ['default' => ''],
        'video_id'        => ['default' => 0, 'type' => 'integer'],
        'video_poster_id' => ['default' => 0, 'type' => 'integer'],
    ];
    foreach ($fields as $key => $opts) {
        register_post_meta('slides', $key, [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => $opts['type'] ?? 'string',
            'default'       => $opts['default'],
            'auth_callback' => '__return_true',
        ]);
    }
});

// Add REST fields that return actual attachment URLs
add_action('rest_api_init', function () {
    register_rest_field('slides', 'video_url', [
        'get_callback' => function ($post_arr) {
            $video_id = (int) get_post_meta($post_arr['id'], 'video_id', true);
            return $video_id ? wp_get_attachment_url($video_id) : null;
        },
        'schema' => ['type' => 'string', 'nullable' => true],
    ]);

    register_rest_field('slides', 'poster_url', [
        'get_callback' => function ($post_arr) {
            $post_id = $post_arr['id'];
            $poster_id = (int) get_post_meta($post_id, 'video_poster_id', true);
            if ($poster_id) {
                return wp_get_attachment_url($poster_id);
            }
            // Fallback: if a video exists but no poster was set, use the featured image
            $video_id = (int) get_post_meta($post_id, 'video_id', true);
            if ($video_id) {
                $thumb_id = get_post_thumbnail_id($post_id);
                if ($thumb_id) {
                    return wp_get_attachment_url($thumb_id);
                }
            }
            return null;
        },
        'schema' => ['type' => 'string', 'nullable' => true],
    ]);
});

// Enqueue media scripts on the slides edit screen
add_action('admin_enqueue_scripts', function ($hook) {
    if (!in_array($hook, ['post.php', 'post-new.php'], true)) return;
    $screen = get_current_screen();
    if (!$screen || $screen->post_type !== 'slides') return;
    wp_enqueue_media();
});

// Meta box
add_action('add_meta_boxes', function () {
    add_meta_box('slides_settings', 'Slide Settings', 'render_slides_meta_box', 'slides', 'normal', 'high');
});

function render_slides_meta_box($post) {
    wp_nonce_field('slides_meta_box', 'slides_meta_box_nonce');

    $cta_text        = get_post_meta($post->ID, 'cta_text', true);
    $cta_url         = get_post_meta($post->ID, 'cta_url', true);
    $cta_product_id  = get_post_meta($post->ID, 'cta_product_id', true);
    $video_id        = (int) get_post_meta($post->ID, 'video_id', true);
    $video_poster_id = (int) get_post_meta($post->ID, 'video_poster_id', true);

    $products = [];
    if (class_exists('WooCommerce')) {
        $products = get_posts([
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'orderby'        => 'title',
            'order'          => 'ASC',
        ]);
    }

    // Helper for an upload field
    $render_upload_field = function($label, $field_name, $attachment_id, $accept = 'video') use ($post) {
        $url = $attachment_id ? wp_get_attachment_url($attachment_id) : '';
        ?>
        <p>
            <label><strong><?php echo esc_html($label); ?></strong></label><br />
            <input type="hidden" name="<?php echo esc_attr($field_name); ?>"
                   value="<?php echo esc_attr($attachment_id); ?>"
                   class="ilife-upload-id" />
            <button type="button" class="button ilife-upload-btn"
                    data-accept="<?php echo esc_attr($accept); ?>">
                <?php echo $attachment_id ? 'Change' : 'Upload'; ?>
            </button>
            <button type="button" class="button ilife-remove-btn"
                    <?php echo !$attachment_id ? 'style="display:none"' : ''; ?>>
                Remove
            </button>
            <span class="ilife-upload-preview" style="display:<?php echo $attachment_id ? 'inline-block' : 'none'; ?>; margin-top:6px;">
                <?php if ($attachment_id) : ?>
                    <?php if ($accept === 'video') : ?>
                        <video src="<?php echo esc_url($url); ?>" controls style="max-width:240px; height:auto;" />
                    <?php else : ?>
                        <img src="<?php echo esc_url($url); ?>" style="max-width:240px; height:auto;" />
                    <?php endif; ?>
                <?php endif; ?>
            </span>
        </p>
        <?php
    };
    ?>

    <!-- CTA -->
    <p>
        <label for="cta_text"><strong>CTA Button Text</strong></label><br />
        <input type="text" id="cta_text" name="cta_text" value="<?php echo esc_attr($cta_text ?: 'Lihat Produk'); ?>" class="large-text" />
    </p>
    <p>
        <label for="cta_product_id"><strong>Link to WooCommerce Product</strong></label><br />
        <select id="cta_product_id" name="cta_product_id" class="large-text" style="width: 100%;">
            <option value=""><?php _e('-- Custom URL / None --'); ?></option>
            <?php foreach ($products as $product) : ?>
                <option value="<?php echo esc_attr($product->ID); ?>" <?php selected($cta_product_id, $product->ID); ?>>
                    <?php echo esc_html($product->post_title); ?>
                </option>
            <?php endforeach; ?>
        </select>
    </p>
    <p>
        <label for="cta_url"><strong>Custom CTA URL</strong></label><br />
        <input type="text" id="cta_url" name="cta_url" value="<?php echo esc_attr($cta_url ?: '/shop'); ?>" class="large-text"
               <?php echo !empty($cta_product_id) ? 'readonly style="background-color: #f0f0f0;"' : ''; ?> />
    </p>

    <!-- Video upload fields -->
    <?php $render_upload_field('Hero Video (optional)', 'video_id', $video_id, 'video'); ?>
    <?php $render_upload_field('Video Poster / Fallback Image (optional)', 'video_poster_id', $video_poster_id, 'image'); ?>

    <script>
    (function($) {
        $('#cta_product_id').on('change', function() {
            if (this.value) {
                $('#cta_url').prop('readonly', true).css('background-color', '#f0f0f0');
            } else {
                $('#cta_url').prop('readonly', false).css('background-color', '');
            }
        });

        // Generic media picker for video / poster
        $('.ilife-upload-btn').on('click', function(e) {
            e.preventDefault();
            var btn = $(this),
                container = btn.closest('p'),
                input = container.find('.ilife-upload-id'),
                preview = container.find('.ilife-upload-preview'),
                removeBtn = container.find('.ilife-remove-btn'),
                accept = btn.data('accept');

            var frame = wp.media({
                title: 'Select ' + (accept === 'video' ? 'video' : 'image'),
                button: { text: 'Use this' },
                library: { type: accept },
                multiple: false
            });

            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                input.val(attachment.id);
                removeBtn.show();
                if (accept === 'video') {
                    preview.html('<video src="'+attachment.url+'" controls style="max-width:240px; height:auto;" />').show();
                } else {
                    preview.html('<img src="'+attachment.url+'" style="max-width:240px; height:auto;" />').show();
                }
            });

            frame.open();
        });

        $('.ilife-remove-btn').on('click', function(e) {
            e.preventDefault();
            var container = $(this).closest('p'),
                input = container.find('.ilife-upload-id'),
                preview = container.find('.ilife-upload-preview');
            input.val('');
            preview.empty().hide();
            $(this).hide();
        });
    })(jQuery);
    </script>
    <?php
}

// Save meta box
add_action('save_post_slides', function ($post_id) {
    if (!isset($_POST['slides_meta_box_nonce']) || !wp_verify_nonce($_POST['slides_meta_box_nonce'], 'slides_meta_box')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['cta_text'])) update_post_meta($post_id, 'cta_text', sanitize_text_field($_POST['cta_text']));

    $product_id = isset($_POST['cta_product_id']) ? sanitize_text_field($_POST['cta_product_id']) : '';
    update_post_meta($post_id, 'cta_product_id', $product_id);
    if (!empty($product_id) && class_exists('WooCommerce')) {
        $product = wc_get_product($product_id);
        if ($product) update_post_meta($post_id, 'cta_url', '/shop/' . $product->get_slug());
    } elseif (isset($_POST['cta_url'])) {
        update_post_meta($post_id, 'cta_url', sanitize_text_field($_POST['cta_url']));
    }

    if (isset($_POST['video_id'])) {
        update_post_meta($post_id, 'video_id', absint($_POST['video_id']));
    }
    if (isset($_POST['video_poster_id'])) {
        update_post_meta($post_id, 'video_poster_id', absint($_POST['video_poster_id']));
    }
});

// Product slug auto-sync (unchanged)
add_action('updated_post_meta', 'handle_slide_meta_update_or_add', 10, 4);
add_action('added_post_meta', 'handle_slide_meta_update_or_add', 10, 4);
function handle_slide_meta_update_or_add($meta_id, $object_id, $meta_key, $_meta_value) {
    if (get_post_type($object_id) !== 'slides') return;
    if ($meta_key === 'cta_product_id') {
        $product_id = $_meta_value;
        if (!empty($product_id) && class_exists('WooCommerce')) {
            $product = wc_get_product($product_id);
            if ($product) {
                remove_action('updated_post_meta', 'handle_slide_meta_update_or_add', 10);
                remove_action('added_post_meta', 'handle_slide_meta_update_or_add', 10);
                update_post_meta($object_id, 'cta_url', '/shop/' . $product->get_slug());
                add_action('updated_post_meta', 'handle_slide_meta_update_or_add', 10, 4);
                add_action('added_post_meta', 'handle_slide_meta_update_or_add', 10, 4);
            }
        }
    }
}