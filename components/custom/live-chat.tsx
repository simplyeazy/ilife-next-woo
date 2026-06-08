"use client";

import Script from "next/script";
import { useEffect } from "react";

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

  // Accessibility fix: Tawk.to dynamically injects/removes iframes without a
  // title attribute, failing Lighthouse. A MutationObserver patches them as
  // they are added so there is no polling overhead.
  useEffect(() => {
    if (!propertyId) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeName === "IFRAME" &&
            !(node as HTMLIFrameElement).hasAttribute("title")
          ) {
            (node as HTMLIFrameElement).setAttribute(
              "title",
              "Tawk.to Live Chat Widget"
            );
          } else if (node.nodeType === 1) {
            (node as HTMLElement)
              .querySelectorAll("iframe:not([title])")
              .forEach((iframe) =>
                iframe.setAttribute("title", "Tawk.to Live Chat Widget")
              );
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [propertyId]);

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
