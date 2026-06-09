<?php
/**
 * Plugin Name: iLife Layanan
 * Description: Registers the 'layanan' CPT for CMS-managed SEO landing pages at /produk/[slug]. Admin dapat membuat halaman layanan baru tanpa perlu mengubah kode.
 * Version: 1.0.0
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 */
if (!defined('ABSPATH')) exit;

add_action('init', function () {
    register_post_type('layanan', [
        'labels' => [
            'name'               => 'Layanan',
            'singular_name'      => 'Layanan',
            'add_new_item'       => 'Tambah Layanan',
            'edit_item'          => 'Edit Layanan',
            'new_item'           => 'Layanan Baru',
            'view_item'          => 'Lihat Layanan',
            'search_items'       => 'Cari Layanan',
            'not_found'          => 'Layanan tidak ditemukan',
            'not_found_in_trash' => 'Tidak ada layanan di trash',
        ],
        // CUSTOM: keep admin permalink/slug UX while routing public pages via Next.js only
        'public'             => true,
        'publicly_queryable' => false,
        'exclude_from_search' => true,
        'has_archive'        => false,
        'show_ui'      => true,
        'show_in_rest' => true, // enables Gutenberg full editor
        'rest_base'    => 'layanan',
        'supports'     => ['title', 'editor', 'excerpt', 'thumbnail'],
        'menu_icon'    => 'dashicons-megaphone',
        'menu_position' => 7,
        'template'     => [], // allow free Gutenberg blocks
    ]);
});

// Register meta fields exposed to REST API
add_action('init', function () {
    $meta_fields = [
        'wc_category' => ['type' => 'string', 'default' => ''],
        'wa_message'  => ['type' => 'string', 'default' => ''],
    ];

    foreach ($meta_fields as $key => $args) {
        register_post_meta('layanan', $key, [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => $args['type'],
            'default'       => $args['default'],
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]);
    }
});

// Add custom meta box
add_action('add_meta_boxes', function () {
    add_meta_box(
        'layanan_meta',
        'Pengaturan Landing Page',
        'layanan_meta_box_callback',
        'layanan',
        'side',
        'high'
    );
});

function layanan_meta_box_callback($post) {
    wp_nonce_field('layanan_meta_nonce', 'layanan_meta_nonce');
    $wc_category = get_post_meta($post->ID, 'wc_category', true);
    $wa_message  = get_post_meta($post->ID, 'wa_message', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="wc_category">Kategori WooCommerce</label></th>
            <td>
                <input type="text" id="wc_category" name="wc_category"
                       value="<?php echo esc_attr($wc_category); ?>" class="widefat" />
                <p class="description">Slug kategori produk WooCommerce, misal: <em>videotron</em>, <em>neonbox</em>, <em>huruf-timbul</em>. Digunakan untuk tombol "Lihat Semua Produk".</p>
            </td>
        </tr>
        <tr>
            <th><label for="wa_message">Pesan WhatsApp (opsional)</label></th>
            <td>
                <textarea id="wa_message" name="wa_message" rows="3" class="widefat"><?php echo esc_textarea($wa_message); ?></textarea>
                <p class="description">Pesan default yang dikirim saat pengunjung klik tombol WhatsApp. Kosongkan untuk menggunakan pesan default.</p>
            </td>
        </tr>
    </table>
    <p style="margin-top:12px;color:#666;font-size:12px;">
        <strong>URL halaman:</strong> <code>/produk/<?php echo esc_html($post->post_name ?: 'slug-layanan'); ?></code>
    </p>
    <?php
}

// Save meta fields
add_action('save_post_layanan', function ($post_id) {
    if (!isset($_POST['layanan_meta_nonce']) ||
        !wp_verify_nonce($_POST['layanan_meta_nonce'], 'layanan_meta_nonce')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['wc_category'])) {
        update_post_meta($post_id, 'wc_category', sanitize_text_field($_POST['wc_category']));
    }
    if (isset($_POST['wa_message'])) {
        update_post_meta($post_id, 'wa_message', sanitize_textarea_field($_POST['wa_message']));
    }
});
