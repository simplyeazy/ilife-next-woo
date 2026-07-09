<?php
/**
 * Plugin Name: iLife Permalinks
 * Description: Redirects WooCommerce product, WordPress page, and post permalinks to the iLife frontend (https://ilife.co.id).
 * Version:     1.0.6
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// WooCommerce products → /produk-dan-layanan/[slug]
add_filter('post_type_link', function ($permalink, $post) {
    if ($post->post_type === 'product') {
        return 'https://ilife.co.id/produk-dan-layanan/' . $post->post_name;
    }
    return $permalink;
}, 10, 2);

// WordPress pages (only those with frontend routes)
add_filter('page_link', function ($link, $post_id) {
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'page') {
        return $link;
    }
    $frontend_pages = ['tentang-kami', 'sertifikat'];
    if (in_array($post->post_name, $frontend_pages, true)) {
        return 'https://ilife.co.id/' . $post->post_name;
    }
    return $link;
}, 10, 2);

// WordPress posts → /artikel/[slug]
add_filter('post_link', function ($permalink, $post) {
    if (!$post || $post->post_type !== 'post') {
        return $permalink;
    }
    return 'https://ilife.co.id/artikel/' . $post->post_name;
}, 10, 2);