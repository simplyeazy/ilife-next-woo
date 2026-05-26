<?php
/**
 * Plugin Name: iLife Produk Showcase
 * Description: Registers the 'produk' CPT for the /produk showcase page. Admins can choose which product images and info appear on the public produk page.
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) exit;

add_action('init', function () {
    register_post_type('produk', [
        'labels'       => [
            'name'               => 'Produk Showcase',
            'singular_name'      => 'Produk',
            'add_new_item'       => 'Tambah Produk',
            'edit_item'          => 'Edit Produk',
            'new_item'           => 'Produk Baru',
            'view_item'          => 'Lihat Produk',
            'search_items'       => 'Cari Produk',
            'not_found'          => 'Produk tidak ditemukan',
            'not_found_in_trash' => 'Tidak ada produk di trash',
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_rest'  => true,
        'rest_base'     => 'produk',
        'supports'      => ['title', 'excerpt', 'thumbnail', 'page-attributes'],
        'menu_icon'     => 'dashicons-products',
        'menu_position' => 5,
    ]);
});

// Register meta fields exposed to REST API
add_action('init', function () {
    $meta_fields = [
        'wc_product_slug'   => ['type' => 'string', 'default' => ''],
        'badge_label'       => ['type' => 'string', 'default' => ''],
        'price_label'       => ['type' => 'string', 'default' => ''],
        'whatsapp_message'  => ['type' => 'string', 'default' => ''],
    ];

    foreach ($meta_fields as $key => $args) {
        register_post_meta('produk', $key, [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => $args['type'],
            'default'       => $args['default'],
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]);
    }
});

// Add custom meta box for ease of editing in classic editor fallback
add_action('add_meta_boxes', function () {
    add_meta_box(
        'produk_meta',
        'Pengaturan Produk',
        'produk_meta_box_callback',
        'produk',
        'normal',
        'high'
    );
});

function produk_meta_box_callback($post) {
    wp_nonce_field('produk_meta_nonce', 'produk_meta_nonce');
    $wc_slug   = get_post_meta($post->ID, 'wc_product_slug', true);
    $badge     = get_post_meta($post->ID, 'badge_label', true);
    $price     = get_post_meta($post->ID, 'price_label', true);
    $wa_msg    = get_post_meta($post->ID, 'whatsapp_message', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="wc_product_slug">WooCommerce Product Slug</label></th>
            <td>
                <input type="text" id="wc_product_slug" name="wc_product_slug"
                       value="<?php echo esc_attr($wc_slug); ?>" class="regular-text" />
                <p class="description">Slug produk WooCommerce (misal: indoor-p1-25). Digunakan untuk tombol "Tambah ke Keranjang".</p>
            </td>
        </tr>
        <tr>
            <th><label for="badge_label">Label Badge</label></th>
            <td>
                <input type="text" id="badge_label" name="badge_label"
                       value="<?php echo esc_attr($badge); ?>" class="regular-text" />
                <p class="description">Tampil di pojok gambar, misal: P1.25, P2.5, Outdoor</p>
            </td>
        </tr>
        <tr>
            <th><label for="price_label">Label Harga</label></th>
            <td>
                <input type="text" id="price_label" name="price_label"
                       value="<?php echo esc_attr($price); ?>" class="regular-text" />
                <p class="description">Teks harga tampilan, misal: "Hubungi kami" atau "Mulai Rp 5.000.000"</p>
            </td>
        </tr>
        <tr>
            <th><label for="whatsapp_message">Pesan WhatsApp (opsional)</label></th>
            <td>
                <textarea id="whatsapp_message" name="whatsapp_message" rows="3"
                          class="regular-text"><?php echo esc_textarea($wa_msg); ?></textarea>
                <p class="description">Pesan pre-isi untuk tombol WhatsApp. Kosongkan untuk pakai pesan default.</p>
            </td>
        </tr>
    </table>
    <?php
}

add_action('save_post_produk', function ($post_id) {
    if (!isset($_POST['produk_meta_nonce']) ||
        !wp_verify_nonce($_POST['produk_meta_nonce'], 'produk_meta_nonce')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $fields = ['wc_product_slug', 'badge_label', 'price_label', 'whatsapp_message'];
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }
    // Allow textarea for whatsapp_message
    if (isset($_POST['whatsapp_message'])) {
        update_post_meta($post_id, 'whatsapp_message', sanitize_textarea_field($_POST['whatsapp_message']));
    }
});
