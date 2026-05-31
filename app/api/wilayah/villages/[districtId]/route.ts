import { NextResponse } from "next/server";

const WP_BASE = process.env.WORDPRESS_URL;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ districtId: string }> }
) {
  const { districtId } = await params;

  if (!/^[\d.]+$/.test(districtId)) {
    return NextResponse.json({ error: "Invalid districtId" }, { status: 400 });
  }

  const res = await fetch(`${WP_BASE}/wp-json/wilayah/v1/villages/${districtId}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch villages" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" },
  });
}
