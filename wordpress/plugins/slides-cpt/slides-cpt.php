<?php
/**
 * Plugin Name: iLife Hero Slides
 * Description: Registers the 'slides' CPT with WooCommerce product picker for the hero carousel
 * Version: 1.1.1
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

add_action('init', function () {
    foreach (['cta_text', 'cta_url', 'cta_product_id'] as $key) {
        register_post_meta('slides', $key, [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => 'string',
            'default'       => $key === 'cta_text' ? 'Lihat Produk' : ($key === 'cta_url' ? '/shop' : ''),
            'auth_callback' => '__return_true',
        ]);
    }
});

// Add custom meta box for Slide Settings
add_action('add_meta_boxes', function () {
    add_meta_box(
        'slides_settings',
        'Slide Settings',
        'render_slides_meta_box',
        'slides',
        'normal',
        'high'
    );
});

function render_slides_meta_box($post) {
    wp_nonce_field('slides_meta_box', 'slides_meta_box_nonce');

    $cta_text = get_post_meta($post->ID, 'cta_text', true);
    $cta_url = get_post_meta($post->ID, 'cta_url', true);
    $cta_product_id = get_post_meta($post->ID, 'cta_product_id', true);

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

    ?>
    <p>
        <label for="cta_text"><strong>CTA Button Text</strong></label><br />
        <input type="text" id="cta_text" name="cta_text" value="<?php echo esc_attr($cta_text ? $cta_text : 'Lihat Produk'); ?>" class="large-text" />
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
        <span class="description">Selecting a product will automatically generate the CTA URL pointing to that product.</span>
    </p>
    <p>
        <label for="cta_url"><strong>Custom CTA URL</strong></label><br />
        <input type="text" id="cta_url" name="cta_url" value="<?php echo esc_attr($cta_url ? $cta_url : '/shop'); ?>" class="large-text" <?php echo !empty($cta_product_id) ? 'readonly style="background-color: #f0f0f0;"' : ''; ?> />
        <span class="description">Enter custom link (e.g. /shop, /about) if no product is selected above.</span>
    </p>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var productSelect = document.getElementById('cta_product_id');
            var urlInput = document.getElementById('cta_url');
            if (productSelect && urlInput) {
                productSelect.addEventListener('change', function() {
                    if (this.value) {
                        urlInput.readOnly = true;
                        urlInput.style.backgroundColor = '#f0f0f0';
                    } else {
                        urlInput.readOnly = false;
                        urlInput.style.backgroundColor = '';
                    }
                });
            }
        });
    </script>
    <?php
}

// Save custom meta box data
add_action('save_post_slides', function ($post_id) {
    if (!isset($_POST['slides_meta_box_nonce']) || !wp_verify_nonce($_POST['slides_meta_box_nonce'], 'slides_meta_box')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['cta_text'])) {
        update_post_meta($post_id, 'cta_text', sanitize_text_field($_POST['cta_text']));
    }

    $product_id = isset($_POST['cta_product_id']) ? sanitize_text_field($_POST['cta_product_id']) : '';
    update_post_meta($post_id, 'cta_product_id', $product_id);

    if (!empty($product_id) && class_exists('WooCommerce')) {
        $product = wc_get_product($product_id);
        if ($product) {
            $slug = $product->get_slug();
            update_post_meta($post_id, 'cta_url', '/shop/' . $slug);
        }
    } elseif (isset($_POST['cta_url'])) {
        update_post_meta($post_id, 'cta_url', sanitize_text_field($_POST['cta_url']));
    }
});

// Handle meta updates via REST API (Gutenberg)
function handle_slide_meta_update_or_add($meta_id, $object_id, $meta_key, $_meta_value) {
    if (get_post_type($object_id) !== 'slides') {
        return;
    }

    if ($meta_key === 'cta_product_id') {
        $product_id = $_meta_value;
        if (!empty($product_id) && class_exists('WooCommerce')) {
            $product = wc_get_product($product_id);
            if ($product) {
                $slug = $product->get_slug();
                // Temporarily remove actions to avoid recursion
                remove_action('updated_post_meta', 'handle_slide_meta_update_or_add', 10);
                remove_action('added_post_meta', 'handle_slide_meta_update_or_add', 10);
                
                update_post_meta($object_id, 'cta_url', '/shop/' . $slug);
                
                add_action('updated_post_meta', 'handle_slide_meta_update_or_add', 10, 4);
                add_action('added_post_meta', 'handle_slide_meta_update_or_add', 10, 4);
            }
        }
    }
}
add_action('updated_post_meta', 'handle_slide_meta_update_or_add', 10, 4);
add_action('added_post_meta', 'handle_slide_meta_update_or_add', 10, 4);