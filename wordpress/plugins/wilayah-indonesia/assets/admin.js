/* global jQuery, wilayahAdmin */
jQuery(function ($) {
    var CHUNK_SIZE = 1000; // rows per AJAX request

    // ---- Import ----
    $('.wilayah-import-btn').on('click', function () {
        var table    = $(this).data('table');
        var fileInput = $('[data-table="' + table + '"].wilayah-file-input')[0];
        var file      = fileInput && fileInput.files[0];

        if (!file) {
            alert('Please select a JSON file first.');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var all;
            try {
                all = JSON.parse(e.target.result);
            } catch (err) {
                alert('Invalid JSON file: ' + err.message);
                return;
            }

            if (!Array.isArray(all)) {
                alert('JSON must be an array.');
                return;
            }

            var total  = all.length;
            var offset = 0;
            var $prog  = $('#wilayah-progress-' + table).show();
            var $bar   = $prog.find('.wilayah-progress-bar');
            var $text  = $prog.find('.wilayah-progress-text');

            function sendChunk() {
                var chunk = all.slice(offset, offset + CHUNK_SIZE);
                if (chunk.length === 0) {
                    $bar.css('width', '100%');
                    $text.text('Done! Imported ' + total + ' rows.');
                    updateCount(table);
                    return;
                }

                $text.text('Importing ' + offset + ' / ' + total + '…');
                $bar.css('width', Math.round((offset / total) * 100) + '%');

                $.post(wilayahAdmin.ajaxUrl, {
                    action : 'wilayah_import_chunk',
                    nonce  : wilayahAdmin.nonce,
                    table  : table,
                    chunk  : JSON.stringify(chunk),
                })
                .done(function (res) {
                    if (res.success) {
                        offset += chunk.length;
                        sendChunk();
                    } else {
                        $text.text('Error: ' + (res.data && res.data.message));
                    }
                })
                .fail(function () {
                    $text.text('Network error. Please try again.');
                });
            }

            sendChunk();
        };
        reader.readAsText(file);
    });

    // ---- Truncate ----
    $('.wilayah-truncate-btn').on('click', function () {
        var table = $(this).data('table');
        if (!confirm('Clear all data in "' + table + '"? This cannot be undone.')) return;

        $.post(wilayahAdmin.ajaxUrl, {
            action : 'wilayah_truncate_table',
            nonce  : wilayahAdmin.nonce,
            table  : table,
        })
        .done(function (res) {
            if (res.success) {
                $('#wilayah-count-' + table).text('0');
                alert(res.data.message);
            } else {
                alert('Error: ' + (res.data && res.data.message));
            }
        });
    });

    function updateCount(table) {
        $.get(wilayahAdmin.ajaxUrl, {
            action : 'wilayah_import_chunk', // reuse nonce endpoint is not ideal;
            // just reload the page for fresh counts
        });
        // Simple reload after a short pause so the user sees "Done"
        setTimeout(function () {
            location.reload();
        }, 1500);
    }
});
