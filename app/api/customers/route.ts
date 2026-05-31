import { NextResponse } from "next/server";

const baseUrl = process.env.WORDPRESS_URL;
const consumerKey = process.env.WC_CONSUMER_KEY;
const consumerSecret = process.env.WC_CONSUMER_SECRET;

export async function POST(request: Request) {
  if (!baseUrl || !consumerKey || !consumerSecret) {
    return NextResponse.json(
      { error: "WooCommerce is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Validate required fields at the API boundary
  const { email, username, password, first_name, last_name, billing, shipping } =
    body as Record<string, unknown>;

  if (!email || !username || !password) {
    return NextResponse.json(
      { error: "email, username, and password are required." },
      { status: 400 }
    );
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const res = await fetch(`${baseUrl}/wp-json/wc/v3/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      email,
      username,
      password,
      first_name: first_name ?? "",
      last_name: last_name ?? "",
      billing: billing ?? {},
      shipping: shipping ?? {},
    }),
  });

  const data = (await res.json()) as Record<string, unknown>;

  if (!res.ok) {
    return NextResponse.json(
      { error: (data.message as string) ?? "Failed to create customer." },
      { status: res.status }
    );
  }

  // Strip sensitive fields before returning to client
  const { id, email: custEmail, first_name: fn, last_name: ln, username: un } = data as {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
  };

  return NextResponse.json({ customer: { id, email: custEmail, first_name: fn, last_name: ln, username: un } });
}
