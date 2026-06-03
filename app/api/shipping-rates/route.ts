import { NextResponse } from "next/server";
import { featureFlags } from "@/site.config";

/**
 * POST /api/shipping-rates
 *
 * Fetches available shipping rates from WooCommerce for a given destination
 * by creating a temporary cart session and querying the WC Store API.
 *
 * Body: { destination: { city, state, postcode, country }, items: [{ product_id, quantity }] }
 */

const WP_BASE = process.env.WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

export async function POST(request: Request) {
  // CUSTOM: JNE shipping lookup disabled via feature flag
  if (!featureFlags.ENABLE_JNE_SHIPPING) {
    return NextResponse.json({ error: "Shipping rate lookup is currently disabled." }, { status: 503 });
  }

  if (!WP_BASE || !WC_KEY || !WC_SECRET) {
    return NextResponse.json({ error: "WooCommerce not configured." }, { status: 503 });
  }

  let body: {
    destination: { city: string; state: string; postcode: string; country: string };
    items: Array<{ product_id: number; quantity: number; variation_id?: number }>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { destination, items } = body;

  if (!destination?.city || !destination?.postcode) {
    return NextResponse.json({ error: "destination.city and destination.postcode are required." }, { status: 400 });
  }

  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");

  // ── Step 1: Create a temporary WC session cart via the Store API ──────────
  // We use the WC REST API orders endpoint to get a shipping estimate instead,
  // which avoids needing a user session.
  //
  // Create a draft order with the destination address and read back shipping lines
  // that WooCommerce calculates (including JNE plugin rates).

  const draftRes = await fetch(`${WP_BASE}/wp-json/wc/v3/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      status: "auto-draft",
      set_paid: false,
      shipping: {
        city: destination.city,
        state: destination.state,
        postcode: destination.postcode,
        country: destination.country ?? "ID",
      },
      billing: {
        city: destination.city,
        state: destination.state,
        postcode: destination.postcode,
        country: destination.country ?? "ID",
        email: "quote@example.com",
      },
      line_items: items.map((i) => ({
        product_id: i.product_id,
        variation_id: i.variation_id ?? 0,
        quantity: i.quantity,
      })),
    }),
  });

  if (!draftRes.ok) {
    const err = (await draftRes.json()) as { message?: string };
    return NextResponse.json({ error: err.message ?? "Failed to fetch shipping rates." }, { status: draftRes.status });
  }

  const draft = (await draftRes.json()) as {
    id: number;
    shipping_lines: Array<{ method_id: string; method_title: string; total: string }>;
  };

  // Clean up the draft order immediately
  await fetch(`${WP_BASE}/wp-json/wc/v3/orders/${draft.id}?force=true`, {
    method: "DELETE",
    headers: { Authorization: `Basic ${auth}` },
  });

  const rates = draft.shipping_lines.map((line) => ({
    method_id: line.method_id,
    method_title: line.method_title,
    total: line.total,
  }));

  return NextResponse.json({ rates });
}
