<?php
/**
 * Plugin Name: iLife Clients
 * Description: Registers the 'clients' CPT for the clients section
 * Version: 1.0.0
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 */
if (!defined('ABSPATH')) exit;

add_action('init', function () {
    register_post_type('clients', [
        'labels'        => ['name' => 'Clients', 'singular_name' => 'Client'],
        'public'        => false,
        'show_ui'       => true,
        'show_in_rest'  => true,
        'rest_base'     => 'clients',
        'supports'      => ['title', 'thumbnail', 'page-attributes'],
        'menu_icon'     => 'dashicons-groups',
    ]);
});

// Register meta fields exposed to REST
add_action('init', function () {
    foreach (['client_url'] as $key) {
        register_post_meta('clients', $key, [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => 'string',
            'default'       => '',
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]);
    }
});