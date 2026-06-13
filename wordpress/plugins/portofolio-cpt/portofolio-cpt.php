<?php
/**
 * Plugin Name: iLife Portofolio
 * Description: Registers the 'portofolio' CPT for the /portofolio gallery page. Admin dapat mengelola proyek-proyek iLife untuk ditampilkan di halaman /portofolio.
 * Version: 1.1.0
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 */
if (!defined('ABSPATH')) exit;

add_action('init', function () {
    register_post_type('portofolio', [
        'labels' => [
            'name'               => 'Portofolio',
            'singular_name'      => 'Proyek',
            'add_new_item'       => 'Tambah Proyek',
            'edit_item'          => 'Edit Proyek',
            'new_item'           => 'Proyek Baru',
            'view_item'          => 'Lihat Proyek',
            'search_items'       => 'Cari Proyek',
            'not_found'          => 'Proyek tidak ditemukan',
            'not_found_in_trash' => 'Tidak ada proyek di trash',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_rest' => true,
        'rest_base'    => 'portofolio',
        'supports'     => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes'],
        'menu_icon'    => 'dashicons-portfolio',
        'menu_position' => 6,
    ]);
});

// Register meta fields exposed to REST API
add_action('init', function () {
    $meta_fields = [
        'kategori'    => ['type' => 'string', 'default' => ''],
        'client_name' => ['type' => 'string', 'default' => ''],
        'project_url' => ['type' => 'string', 'default' => ''],
        'tahun'       => ['type' => 'string', 'default' => ''],
        'is_featured' => ['type' => 'boolean', 'default' => false],
    ];

    foreach ($meta_fields as $key => $args) {
        register_post_meta('portofolio', $key, [
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
        'portofolio_meta',
        'Detail Proyek',
        'portofolio_meta_box_callback',
        'portofolio',
        'normal',
        'high'
    );
});

function portofolio_meta_box_callback($post) {
    wp_nonce_field('portofolio_meta_nonce', 'portofolio_meta_nonce');
    $kategori    = get_post_meta($post->ID, 'kategori', true);
    $client_name = get_post_meta($post->ID, 'client_name', true);
    $project_url = get_post_meta($post->ID, 'project_url', true);
    $tahun       = get_post_meta($post->ID, 'tahun', true);
    $is_featured  = get_post_meta($post->ID, 'is_featured', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="kategori">Kategori</label></th>
            <td>
                <input type="text" id="kategori" name="kategori"
                       value="<?php echo esc_attr($kategori); ?>" class="regular-text" />
                <p class="description">Kategori proyek, misal: LED Display, Signage, Videotron, Event</p>
            </td>
        </tr>
        <tr>
            <th><label for="client_name">Nama Klien</label></th>
            <td>
                <input type="text" id="client_name" name="client_name"
                       value="<?php echo esc_attr($client_name); ?>" class="regular-text" />
                <p class="description">Nama perusahaan atau klien (opsional)</p>
            </td>
        </tr>
        <tr>
            <th><label for="project_url">URL Proyek</label></th>
            <td>
                <input type="url" id="project_url" name="project_url"
                       value="<?php echo esc_attr($project_url); ?>" class="regular-text" />
                <p class="description">Tautan ke halaman proyek atau referensi (opsional)</p>
            </td>
        </tr>
        <tr>
            <th><label for="tahun">Tahun</label></th>
            <td>
                <input type="text" id="tahun" name="tahun"
                       value="<?php echo esc_attr($tahun); ?>" class="regular-text" placeholder="<?php echo date('Y'); ?>" />
                <p class="description">Tahun pelaksanaan proyek</p>
            </td>
        </tr>
        <tr>
            <th><label for="is_featured">Featured</label></th>
            <td>
                <input type="checkbox" id="is_featured" name="is_featured" value="1" <?php checked($is_featured, '1'); ?> />
                <p class="description">Tandai jika proyek ini ingin ditampilkan sebagai proyek unggulan</p>
            </td>
        </tr>
    </table>
    <?php
}

add_action('save_post_portofolio', function ($post_id) {
    if (!isset($_POST['portofolio_meta_nonce'])) return;
    if (!wp_verify_nonce($_POST['portofolio_meta_nonce'], 'portofolio_meta_nonce')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $fields = ['kategori', 'client_name', 'project_url', 'tahun'];
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }
    $is_featured = isset($_POST['is_featured']) ? '1' : '0';
    update_post_meta($post_id, 'is_featured', $is_featured);
});
