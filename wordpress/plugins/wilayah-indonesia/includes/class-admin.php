<?php
if (!defined('ABSPATH')) exit;

class Wilayah_Admin {

    public static function add_menu(): void {
        add_menu_page(
            'Wilayah Indonesia',
            'Wilayah',
            'manage_options',
            'wilayah-indonesia',
            [self::class, 'render_page'],
            'dashicons-location-alt',
            30
        );
    }

    public static function enqueue_scripts(string $hook): void {
        if ($hook !== 'toplevel_page_wilayah-indonesia') {
            return;
        }
        wp_enqueue_script(
            'wilayah-admin',
            plugins_url('assets/admin.js', WILAYAH_PLUGIN_DIR . 'wilayah-indonesia.php'),
            ['jquery'],
            WILAYAH_VERSION,
            true
        );
        wp_localize_script('wilayah-admin', 'wilayahAdmin', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('wilayah_import'),
        ]);
    }

    public static function render_page(): void {
        global $wpdb;
        $counts = [];
        foreach (['provinces', 'cities', 'districts', 'villages'] as $t) {
            $table       = $wpdb->prefix . 'wilayah_' . $t;
            // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
            $counts[$t] = (int) $wpdb->get_var("SELECT COUNT(*) FROM `$table`");
        }
        ?>
        <div class="wrap">
            <h1>Wilayah Indonesia — Data Import</h1>
            <p>Import Indonesian administrative region data. Upload each JSON file separately. Large files (districts, villages) are processed in chunks automatically.</p>

            <table class="widefat fixed" style="max-width:500px;margin-bottom:20px">
                <thead><tr><th>Table</th><th>Rows</th></tr></thead>
                <tbody>
                <?php foreach ($counts as $name => $count): ?>
                    <tr>
                        <td><?php echo esc_html(ucfirst($name)); ?></td>
                        <td id="wilayah-count-<?php echo esc_attr($name); ?>"><?php echo esc_html(number_format($count)); ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>

            <h2>Import JSON</h2>
            <p>Expected JSON format per file:</p>
            <ul>
                <li><strong>Provinces:</strong> <code>[{"Id":"11","Name":"ACEH"}, ...]</code></li>
                <li><strong>Cities:</strong> <code>[{"Id":"11.01","ProvinceId":"11","Name":"KAB. ACEH SELATAN"}, ...]</code></li>
                <li><strong>Districts:</strong> <code>[{"Id":"11.01.01","CityRegencyId":"11.01","Name":"Bakongan"}, ...]</code></li>
                <li><strong>Villages:</strong> <code>[{"Id":"11.01.01.2001","Name":"Keude Bakongan","DistrictId":"11.01.01","PostalCode":"23773"}, ...]</code></li>
            </ul>

            <?php foreach (['provinces', 'cities', 'districts', 'villages'] as $t): ?>
            <div class="wilayah-import-section" style="margin-bottom:30px;padding:15px;border:1px solid #ccd0d4;background:#fff;max-width:600px">
                <h3 style="margin-top:0"><?php echo esc_html(ucfirst($t)); ?></h3>
                <input type="file" class="wilayah-file-input" data-table="<?php echo esc_attr($t); ?>" accept=".json" />
                <button class="button button-primary wilayah-import-btn" data-table="<?php echo esc_attr($t); ?>" style="margin-left:8px">Import</button>
                <button class="button wilayah-truncate-btn" data-table="<?php echo esc_attr($t); ?>" style="margin-left:8px;color:#cc0000">Clear Table</button>
                <div class="wilayah-progress" id="wilayah-progress-<?php echo esc_attr($t); ?>" style="margin-top:10px;display:none">
                    <div style="background:#e0e0e0;border-radius:4px;overflow:hidden">
                        <div class="wilayah-progress-bar" style="background:#0073aa;height:20px;width:0%;transition:width 0.3s"></div>
                    </div>
                    <p class="wilayah-progress-text" style="margin:4px 0 0 0;font-size:12px;color:#555"></p>
                </div>
            </div>
            <?php endforeach; ?>

            <h2>REST API Endpoints</h2>
            <p>Base URL: <code><?php echo esc_url(rest_url('wilayah/v1')); ?></code></p>
            <ul>
                <li><a href="<?php echo esc_url(rest_url('wilayah/v1/provinces')); ?>" target="_blank"><?php echo esc_url(rest_url('wilayah/v1/provinces')); ?></a></li>
                <li><code><?php echo esc_url(rest_url('wilayah/v1/cities/{provinceId}')); ?></code></li>
                <li><code><?php echo esc_url(rest_url('wilayah/v1/districts/{cityId}')); ?></code></li>
                <li><code><?php echo esc_url(rest_url('wilayah/v1/villages/{districtId}')); ?></code></li>
            </ul>
        </div>
        <?php
    }

    /**
     * AJAX: import a chunk of rows.
     * Expects: table, chunk (JSON string), nonce
     */
    public static function handle_import_chunk(): void {
        check_ajax_referer('wilayah_import', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized.'], 403);
        }

        $table = sanitize_key($_POST['table'] ?? '');
        $chunk = stripslashes($_POST['chunk'] ?? '');

        if (empty($table) || empty($chunk)) {
            wp_send_json_error(['message' => 'Missing parameters.'], 400);
        }

        $rows_raw = json_decode($chunk, true);
        if (!is_array($rows_raw)) {
            wp_send_json_error(['message' => 'Invalid JSON chunk.'], 400);
        }

        // Normalise keys to match DB column names
        $rows = array_map(fn($r) => self::normalise_row($table, $r), $rows_raw);

        $result = Wilayah_Database::bulk_insert($table, $rows);

        if (is_wp_error($result)) {
            wp_send_json_error(['message' => $result->get_error_message()], 500);
        }

        wp_send_json_success(['inserted' => $result]);
    }

    /**
     * AJAX: truncate a table.
     */
    public static function handle_truncate_table(): void {
        check_ajax_referer('wilayah_import', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized.'], 403);
        }

        $table = sanitize_key($_POST['table'] ?? '');

        if (!Wilayah_Database::truncate($table)) {
            wp_send_json_error(['message' => 'Invalid table.'], 400);
        }

        wp_send_json_success(['message' => "Table {$table} cleared."]);
    }

    /**
     * Map JSON keys from the upstream data format to DB column names.
     */
    private static function normalise_row(string $table, array $row): array {
        return match($table) {
            'provinces' => [
                'id'   => $row['Id'] ?? '',
                'name' => $row['Name'] ?? '',
            ],
            'cities' => [
                'id'          => $row['Id'] ?? '',
                'province_id' => $row['ProvinceId'] ?? '',
                'name'        => $row['Name'] ?? '',
            ],
            'districts' => [
                'id'      => $row['Id'] ?? '',
                'city_id' => $row['CityRegencyId'] ?? '',
                'name'    => $row['Name'] ?? '',
            ],
            'villages' => [
                'id'          => $row['Id'] ?? '',
                'district_id' => $row['DistrictId'] ?? '',
                'name'        => $row['Name'] ?? '',
                'postal_code' => $row['PostalCode'] ?? null,
            ],
            default => $row,
        };
    }
}
