<?php
/**
 * Plugin Name: iLife Logo
 * Description: Registers the 'logo' CPT so the site logo can be managed from WordPress. Upload a featured image to the active Logo post and it will replace the default SVG logo on the front-end.
 * Version: 1.0.0
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 * Plugin URI: https://lundy.dev
 */
if (!defined('ABSPATH')) exit;

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
        'description'  => 'Upload a featured image here to replace the default site logo. By lundy.dev',
    ]);
});
