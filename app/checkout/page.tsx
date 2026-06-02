"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useCart } from "@/components/shop/cart-provider";
import { formatPrice } from "@/lib/woocommerce";
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AddressSelector, EMPTY_WILAYAH, type WilayahAddress } from "@/components/shop/address-selector";

interface ShippingRate {
  method_id: string;
  method_title: string;
  total: string;
}

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  /** Street address line typed by user (jalan, nomor rumah, RT/RW) */
  address1: string;
  phone: string;
  notes: string;
  /** Cascading Indonesian region selector */
  wilayah: WilayahAddress;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, isLoading, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    phone: "",
    notes: "",
    wilayah: EMPTY_WILAYAH,
  });

  // Fetch JNE shipping rates whenever a complete address is provided
  const fetchShippingRates = useCallback(async (wilayah: WilayahAddress) => {
    if (!wilayah.cityName || !wilayah.postcode) return;

    setLoadingRates(true);
    setShippingRates([]);
    setSelectedShipping(null);

    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: {
            city: wilayah.cityName,
            state: wilayah.provinceName,
            postcode: wilayah.postcode,
            country: "ID",
          },
          items: cart.items.map((i) => ({
            product_id: i.productId,
            variation_id: i.variationId,
            quantity: i.quantity,
          })),
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { rates: ShippingRate[] };
        setShippingRates(data.rates ?? []);
        if (data.rates?.length === 1) setSelectedShipping(data.rates[0]);
      }
    } finally {
      setLoadingRates(false);
    }
  }, [cart.items]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.company,
            address_1: formData.address1,
            // district + village appended so JNE plugin sees complete sub-district info
            address_2: [formData.wilayah.districtName, formData.wilayah.villageName]
              .filter(Boolean).join(", "),
            city: formData.wilayah.cityName,
            state: formData.wilayah.provinceName,
            postcode: formData.wilayah.postcode,
            country: "ID",
            email: formData.email,
            phone: formData.phone,
          },
          shipping: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.company,
            address_1: formData.address1,
            address_2: [formData.wilayah.districtName, formData.wilayah.villageName]
              .filter(Boolean).join(", "),
            city: formData.wilayah.cityName,
            state: formData.wilayah.provinceName,
            postcode: formData.wilayah.postcode,
            country: "ID",
          },
          line_items: cart.items.map((item) => ({
            product_id: item.productId,
            variation_id: item.variationId,
            quantity: item.quantity,
          })),
          // Include selected JNE shipping rate so order total is correct
          shipping_lines: selectedShipping
            ? [{ method_id: selectedShipping.method_id, method_title: selectedShipping.method_title, total: selectedShipping.total }]
            : [],
          customer_note: formData.notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create order");
      }

      const { order } = await response.json();

      // Store order ID for reference, then redirect to WooCommerce payment
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pending_order_id", order.id.toString());
      }

      // Redirect to WooCommerce checkout for payment
      if (order.payment_url) {
        window.location.href = order.payment_url;
      } else {
        // Fallback if no payment needed (free order)
        clearCart();
        router.push(`/checkout/success?order=${order.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Section>
        <Container>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Container>
      </Section>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Section>
        <Container>
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">keranjang anda kosong</h1>
              <p className="text-muted-foreground">
                Anda belum menambahkan apa pun ke keranjang Anda.
              </p>
            </div>
            <Button asChild>
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Lanjutkan belanja
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Billing Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-bold">Detail Penagihan</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nama Depan *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nama Belakang *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Perusahaan (opsional)</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telepon *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address1">Alamat Jalan *</Label>
                    <Input
                      id="address1"
                      name="address1"
                      required
                      placeholder="Nama jalan, nomor rumah, RT/RW"
                      value={formData.address1}
                      onChange={handleInputChange}
                    />
                  </div>

                  <AddressSelector
                    value={formData.wilayah}
                    onChange={(wilayah) => {
                      setFormData((prev) => ({ ...prev, wilayah }));
                      // Fetch JNE rates once we have city + postcode
                      if (wilayah.cityName && wilayah.postcode) {
                        fetchShippingRates(wilayah);
                      }
                    }}
                    required
                  />
                </div>

                {/* ── Shipping method ─────────────────────────────── */}
                <div className="border rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-bold">Metode Pengiriman</h2>

                  {!formData.wilayah.cityName && (
                    <p className="text-sm text-muted-foreground">Pilih alamat terlebih dahulu untuk melihat opsi pengiriman.</p>
                  )}

                  {loadingRates && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memuat ongkos kirim…
                    </div>
                  )}

                  {!loadingRates && shippingRates.length > 0 && (
                    <div className="space-y-2">
                      {shippingRates.map((rate) => (
                        <label
                          key={rate.method_id}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedShipping?.method_id === rate.method_id
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping_method"
                              value={rate.method_id}
                              checked={selectedShipping?.method_id === rate.method_id}
                              onChange={() => setSelectedShipping(rate)}
                              className="accent-primary"
                            />
                            <span className="text-sm font-medium">{rate.method_title}</span>
                          </div>
                          <span className="text-sm font-semibold">{formatPrice(rate.total)}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {!loadingRates && formData.wilayah.cityName && shippingRates.length === 0 && (
                    <p className="text-sm text-destructive">Tidak ada layanan pengiriman tersedia untuk alamat ini.</p>
                  )}
                </div>

                <div className="border rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-bold">Catatan Pesanan (opsional)</h2>
                  <textarea
                    name="notes"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Catatan tentang pesanan Anda, misalnya catatan khusus untuk pengiriman"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="border rounded-lg p-6 space-y-4 sticky top-4">
                  <h2 className="text-xl font-bold">Ringkasan Pesanan</h2>

                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variationId || ""}`}
                        className="flex gap-3"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground text-xs">
                              Tidak ada gambar
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice(
                            (parseFloat(item.price) * item.quantity).toString()
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(cart.totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ongkos Kirim</span>
                      <span>
                        {selectedShipping
                          ? formatPrice(selectedShipping.total)
                          : loadingRates
                          ? "Memuat…"
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(cart.totals.total)}</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || loadingRates || (shippingRates.length > 0 && !selectedShipping)}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Lanjutkan ke Pembayaran"
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Dengan melakukan pemesanan, Anda menyetujui Ketentuan Layanan dan
                    Kebijakan Privasi.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </Section>
  );
}
