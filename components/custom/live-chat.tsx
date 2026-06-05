"use client";

import Script from "next/script";

/**
 * Tawk.to live chat widget.
 *
 * Setup:
 * 1. Daftar di https://www.tawk.to dan buat properti baru.
 * 2. Salin Property ID dan Widget ID dari Settings → Chat Widget.
 * 3. Isi env vars:
 *      NEXT_PUBLIC_TAWKTO_PROPERTY_ID=xxxxxxxxxxxxxxxxxxxxxxxx
 *      NEXT_PUBLIC_TAWKTO_WIDGET_ID=default   (atau ID widget custom)
 * 4. Install plugin "Tawk.To Live Chat" di WordPress agar staff bisa
 *    membalas chat langsung dari WP Admin.
 *
 * Selama env vars belum diisi, komponen ini tidak merender apapun.
 */
export function LiveChatWidget() {
  const propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID ?? "default";

  if (!propertyId) return null;

  const tawkSrc = `https://embed.tawk.to/${propertyId}/${widgetId}`;

  return (
    <Script
      id="tawkto-widget"
      src={tawkSrc}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
