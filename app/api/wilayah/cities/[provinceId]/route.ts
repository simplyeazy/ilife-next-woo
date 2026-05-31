import { NextResponse } from "next/server";

const WP_BASE = process.env.WORDPRESS_URL;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ provinceId: string }> }
) {
  const { provinceId } = await params;

  if (!/^\d+$/.test(provinceId)) {
    return NextResponse.json({ error: "Invalid provinceId" }, { status: 400 });
  }

  const res = await fetch(`${WP_BASE}/wp-json/wilayah/v1/cities/${provinceId}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" },
  });
}
