<?php
if (!defined('ABSPATH')) exit;

class Wilayah_Database {

    public static function create_tables(): void {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        dbDelta("CREATE TABLE {$wpdb->prefix}wilayah_provinces (
            id VARCHAR(10) NOT NULL,
            name VARCHAR(100) NOT NULL,
            PRIMARY KEY (id),
            KEY name (name(50))
        ) $charset_collate;");

        dbDelta("CREATE TABLE {$wpdb->prefix}wilayah_cities (
            id VARCHAR(10) NOT NULL,
            province_id VARCHAR(10) NOT NULL,
            name VARCHAR(150) NOT NULL,
            PRIMARY KEY (id),
            KEY province_id (province_id)
        ) $charset_collate;");

        dbDelta("CREATE TABLE {$wpdb->prefix}wilayah_districts (
            id VARCHAR(20) NOT NULL,
            city_id VARCHAR(10) NOT NULL,
            name VARCHAR(150) NOT NULL,
            PRIMARY KEY (id),
            KEY city_id (city_id)
        ) $charset_collate;");

        dbDelta("CREATE TABLE {$wpdb->prefix}wilayah_villages (
            id VARCHAR(20) NOT NULL,
            district_id VARCHAR(20) NOT NULL,
            name VARCHAR(150) NOT NULL,
            postal_code VARCHAR(10) DEFAULT NULL,
            PRIMARY KEY (id),
            KEY district_id (district_id)
        ) $charset_collate;");

        update_option('wilayah_db_version', WILAYAH_DB_VERSION);
    }

    /**
     * Bulk-insert rows into a wilayah table.
     * Returns number of rows inserted or WP_Error on failure.
     *
     * @param string $table  One of: provinces, cities, districts, villages
     * @param array  $rows   Array of associative arrays matching the column structure
     * @return int|WP_Error
     */
    public static function bulk_insert(string $table, array $rows): int|WP_Error {
        global $wpdb;

        $allowed = ['provinces', 'cities', 'districts', 'villages'];
        if (!in_array($table, $allowed, true)) {
            return new WP_Error('invalid_table', 'Invalid table name.');
        }

        $table_name = $wpdb->prefix . 'wilayah_' . $table;
        $columns    = self::get_columns($table);
        $placeholders = '(' . implode(',', array_fill(0, count($columns), '%s')) . ')';

        $inserted = 0;
        // Process in chunks of 500 rows to avoid memory / query size issues
        foreach (array_chunk($rows, 500) as $chunk) {
            $values = [];
            $data   = [];

            foreach ($chunk as $row) {
                $values[] = $placeholders;
                foreach ($columns as $col) {
                    $data[] = $row[$col] ?? '';
                }
            }

            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
            $sql = "INSERT IGNORE INTO `$table_name` (`" . implode('`,`', $columns) . "`) VALUES "
                 . implode(',', $values);

            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
            $result = $wpdb->query($wpdb->prepare($sql, $data));

            if ($result === false) {
                return new WP_Error('db_error', $wpdb->last_error);
            }
            $inserted += (int) $result;
        }

        return $inserted;
    }

    public static function truncate(string $table): bool {
        global $wpdb;
        $allowed = ['provinces', 'cities', 'districts', 'villages'];
        if (!in_array($table, $allowed, true)) {
            return false;
        }
        $table_name = $wpdb->prefix . 'wilayah_' . $table;
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $wpdb->query("TRUNCATE TABLE `$table_name`");
        return true;
    }

    private static function get_columns(string $table): array {
        return match($table) {
            'provinces' => ['id', 'name'],
            'cities'    => ['id', 'province_id', 'name'],
            'districts' => ['id', 'city_id', 'name'],
            'villages'  => ['id', 'district_id', 'name', 'postal_code'],
            default     => [],
        };
    }
}
