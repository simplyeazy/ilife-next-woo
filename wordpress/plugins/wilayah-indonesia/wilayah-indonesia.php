<?php
/**
 * Plugin Name: Wilayah Indonesia
 * Description: Stores Indonesian administrative regions (provinces, cities, districts, villages) and exposes them via REST API.
 * Version: 1.0.0
 * Author: <a href="https://lundy.dev">lundy.dev</a>
 * Author URI: https://lundy.dev
 * Plugin URI: https://lundy.dev
 */

if (!defined('ABSPATH')) exit;

define('WILAYAH_VERSION', '1.0.0');
define('WILAYAH_DB_VERSION', '1.0.0');
define('WILAYAH_PLUGIN_DIR', plugin_dir_path(__FILE__));

require_once WILAYAH_PLUGIN_DIR . 'includes/class-database.php';
require_once WILAYAH_PLUGIN_DIR . 'includes/class-rest-api.php';
require_once WILAYAH_PLUGIN_DIR . 'includes/class-admin.php';

register_activation_hook(__FILE__, ['Wilayah_Database', 'create_tables']);

add_action('rest_api_init', ['Wilayah_REST_API', 'register_routes']);

add_action('admin_menu', ['Wilayah_Admin', 'add_menu']);
add_action('admin_enqueue_scripts', ['Wilayah_Admin', 'enqueue_scripts']);
add_action('wp_ajax_wilayah_import_chunk', ['Wilayah_Admin', 'handle_import_chunk']);
add_action('wp_ajax_wilayah_truncate_table', ['Wilayah_Admin', 'handle_truncate_table']);
