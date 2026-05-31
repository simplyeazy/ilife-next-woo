import { NextResponse } from "next/server";

const WP_BASE = process.env.WORDPRESS_URL;

export async function GET() {
  const res = await fetch(`${WP_BASE}/wp-json/wilayah/v1/provinces`, {
    next: { revalidate: 86400 }, // 24 h — this data never changes
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch provinces" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" },
  });
}
