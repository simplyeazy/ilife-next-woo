<?php
if (!defined('ABSPATH')) exit;

class Wilayah_REST_API {

    private const NAMESPACE = 'wilayah/v1';

    public static function register_routes(): void {
        register_rest_route(self::NAMESPACE, '/provinces', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [self::class, 'get_provinces'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route(self::NAMESPACE, '/cities/(?P<province_id>[0-9.]+)', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [self::class, 'get_cities'],
            'permission_callback' => '__return_true',
            'args'                => [
                'province_id' => [
                    'required'          => true,
                    'validate_callback' => fn($v) => (bool) preg_match('/^[0-9]+$/', $v),
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);

        register_rest_route(self::NAMESPACE, '/districts/(?P<city_id>[0-9.]+)', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [self::class, 'get_districts'],
            'permission_callback' => '__return_true',
            'args'                => [
                'city_id' => [
                    'required'          => true,
                    'validate_callback' => fn($v) => (bool) preg_match('/^[0-9.]+$/', $v),
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);

        register_rest_route(self::NAMESPACE, '/villages/(?P<district_id>[0-9.]+)', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [self::class, 'get_villages'],
            'permission_callback' => '__return_true',
            'args'                => [
                'district_id' => [
                    'required'          => true,
                    'validate_callback' => fn($v) => (bool) preg_match('/^[0-9.]+$/', $v),
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);
    }

    public static function get_provinces(WP_REST_Request $request): WP_REST_Response|WP_Error {
        global $wpdb;
        $table = $wpdb->prefix . 'wilayah_provinces';
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $rows = $wpdb->get_results("SELECT id AS `Id`, name AS `Name` FROM `$table` ORDER BY name ASC", ARRAY_A);

        if ($rows === null) {
            return new WP_Error('db_error', $wpdb->last_error, ['status' => 500]);
        }

        return self::cached_response($rows, 'provinces');
    }

    public static function get_cities(WP_REST_Request $request): WP_REST_Response|WP_Error {
        global $wpdb;
        $province_id = $request->get_param('province_id');
        $table = $wpdb->prefix . 'wilayah_cities';

        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT id AS `Id`, province_id AS `ProvinceId`, name AS `Name` FROM `$table` WHERE province_id = %s ORDER BY name ASC",
                $province_id
            ),
            ARRAY_A
        );

        if ($rows === null) {
            return new WP_Error('db_error', $wpdb->last_error, ['status' => 500]);
        }

        return self::cached_response($rows, 'cities_' . $province_id);
    }

    public static function get_districts(WP_REST_Request $request): WP_REST_Response|WP_Error {
        global $wpdb;
        $city_id = $request->get_param('city_id');
        $table = $wpdb->prefix . 'wilayah_districts';

        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT id AS `Id`, city_id AS `CityRegencyId`, name AS `Name` FROM `$table` WHERE city_id = %s ORDER BY name ASC",
                $city_id
            ),
            ARRAY_A
        );

        if ($rows === null) {
            return new WP_Error('db_error', $wpdb->last_error, ['status' => 500]);
        }

        return self::cached_response($rows, 'districts_' . $city_id);
    }

    public static function get_villages(WP_REST_Request $request): WP_REST_Response|WP_Error {
        global $wpdb;
        $district_id = $request->get_param('district_id');
        $table = $wpdb->prefix . 'wilayah_villages';

        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT id AS `Id`, name AS `Name`, district_id AS `DistrictId`, postal_code AS `PostalCode` FROM `$table` WHERE district_id = %s ORDER BY name ASC",
                $district_id
            ),
            ARRAY_A
        );

        if ($rows === null) {
            return new WP_Error('db_error', $wpdb->last_error, ['status' => 500]);
        }

        return self::cached_response($rows, 'villages_' . $district_id);
    }

    /**
     * Return a REST response with Cache-Control headers and optional transient caching.
     */
    private static function cached_response(array $data, string $cache_key): WP_REST_Response {
        $response = new WP_REST_Response($data, 200);
        // Cache for 24 h on the CDN / browser — this data rarely changes
        $response->header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
        $response->header('X-WP-Total', (string) count($data));
        return $response;
    }
}
