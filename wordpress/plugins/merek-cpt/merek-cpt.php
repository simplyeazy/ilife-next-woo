<?php
/**
 * Plugin Name: Merek Produk CPT
 * Description: Curated brand showcase. Each entry maps a brand logo to a WooCommerce brand slug and/or manufacturer website.
 * Version: 1.0.0
 */
if ( ! defined( 'ABSPATH' ) ) exit;

// Register post type
add_action( 'init', function () {
    register_post_type( 'merek_produk', [
        'label'               => 'Merek Produk',
        'labels'              => [
            'name'          => 'Merek Produk',
            'singular_name' => 'Merek',
            'add_new_item'  => 'Tambah Merek',
            'edit_item'     => 'Edit Merek',
            'new_item'      => 'Merek Baru',
        ],
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,
        'rest_base'           => 'merek_produk',
        'supports'            => [ 'title', 'thumbnail', 'custom-fields', 'page-attributes' ],
        'menu_icon'           => 'dashicons-awards',
        'rewrite'             => false,
    ] );
} );

// Register meta fields (exposed to REST API)
add_action( 'init', function () {
    register_post_meta( 'merek_produk', 'brand_url', [
        'type'              => 'string',
        'description'       => 'URL website resmi merek',
        'single'            => true,
        'show_in_rest'      => true,
        'sanitize_callback' => 'sanitize_url',
        'auth_callback'     => '__return_true',
    ] );

    register_post_meta( 'merek_produk', 'wc_brand_slug', [
        'type'              => 'string',
        'description'       => 'Slug brand WooCommerce (untuk filter /produk?brand=<slug>)',
        'single'            => true,
        'show_in_rest'      => true,
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback'     => '__return_true',
    ] );
} );

// Meta box for convenient editing in WP admin
add_action( 'add_meta_boxes', function () {
    add_meta_box(
        'merek_meta_box',
        'Detail Merek',
        'merek_cpt_meta_box_html',
        'merek_produk',
        'normal',
        'high'
    );
} );

function merek_cpt_meta_box_html( $post ) {
    $brand_url     = get_post_meta( $post->ID, 'brand_url', true );
    $wc_brand_slug = get_post_meta( $post->ID, 'wc_brand_slug', true );
    wp_nonce_field( 'merek_meta_save', 'merek_meta_nonce' );
    ?>
    <table class="form-table">
        <tr>
            <th><label for="brand_url">URL Website Merek</label></th>
            <td>
                <input type="url" id="brand_url" name="brand_url"
                       value="<?php echo esc_attr( $brand_url ); ?>"
                       style="width:100%" placeholder="https://www.novastar.tech/" />
                <p class="description">Link ke website resmi produsen/merek.</p>
            </td>
        </tr>
        <tr>
            <th><label for="wc_brand_slug">Slug Brand WooCommerce</label></th>
            <td>
                <input type="text" id="wc_brand_slug" name="wc_brand_slug"
                       value="<?php echo esc_attr( $wc_brand_slug ); ?>"
                       style="width:100%" placeholder="novastar" />
                <p class="description">Slug brand dari WooCommerce. Klik logo akan filter ke <code>/produk?brand=&lt;slug&gt;</code>.</p>
            </td>
        </tr>
    </table>
    <?php
}

add_action( 'save_post_merek_produk', function ( $post_id ) {
    if ( ! isset( $_POST['merek_meta_nonce'] ) || ! wp_verify_nonce( $_POST['merek_meta_nonce'], 'merek_meta_save' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    if ( isset( $_POST['brand_url'] ) ) {
        update_post_meta( $post_id, 'brand_url', sanitize_url( wp_unslash( $_POST['brand_url'] ) ) );
    }
    if ( isset( $_POST['wc_brand_slug'] ) ) {
        update_post_meta( $post_id, 'wc_brand_slug', sanitize_text_field( wp_unslash( $_POST['wc_brand_slug'] ) ) );
    }
} );
