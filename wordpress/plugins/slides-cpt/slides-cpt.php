<?php
/**
 * Plugin Name: iLife Hero Slides
 * Description: Registers the 'slides' CPT for the hero carousel
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) exit;

add_action('init', function () {
    register_post_type('slides', [
        'labels'       => ['name' => 'Hero Slides', 'singular_name' => 'Slide'],
        'public'       => false,
        'show_ui'      => true,
        'show_in_rest' => true,
        'rest_base'    => 'slides',
        'supports'     => ['title', 'excerpt', 'thumbnail', 'page-attributes'],
        'menu_icon'    => 'dashicons-images-alt2',
    ]);
});

add_action('init', function () {
    foreach (['cta_text', 'cta_url'] as $key) {
        register_post_meta('slides', $key, [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => 'string',
            'default'       => $key === 'cta_text' ? 'Lihat Produk' : '/shop',
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]);
    }
});