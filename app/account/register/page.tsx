"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AddressSelector,
  EMPTY_WILAYAH,
  type WilayahAddress,
} from "@/components/shop/address-selector";

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  /** Street address typed by user */
  address1: string;
  /** Indonesian cascading address */
  wilayah: WilayahAddress;
}

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    wilayah: EMPTY_WILAYAH,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (!formData.wilayah.cityId) {
      setError("Pilih Kabupaten/Kota terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    const address2 = [formData.wilayah.districtName, formData.wilayah.villageName]
      .filter(Boolean)
      .join(", ");

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          billing: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address_1: formData.address1,
            address_2: address2,
            city: formData.wilayah.cityName,
            state: formData.wilayah.provinceName,
            postcode: formData.wilayah.postcode,
            country: "ID",
          },
          shipping: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            address_1: formData.address1,
            address_2: address2,
            city: formData.wilayah.cityName,
            state: formData.wilayah.provinceName,
            postcode: formData.wilayah.postcode,
            country: "ID",
          },
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Pendaftaran gagal.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/shop"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Section>
        <Container>
          <div className="max-w-md mx-auto text-center space-y-4 py-16">
            <div className="text-5xl">✓</div>
            <h1 className="text-2xl font-bold">Akun berhasil dibuat!</h1>
            <p className="text-muted-foreground">
              Anda akan segera diarahkan ke halaman toko…
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="max-w-lg mx-auto space-y-8 py-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Daftar Akun</h1>
            <p className="text-muted-foreground">
              Sudah punya akun?{" "}
              <Link
                href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/my-account`}
                className="text-primary underline underline-offset-4"
              >
                Masuk di sini
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Account info ─────────────────────────────────── */}
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Informasi Akun</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nama Depan *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nama Belakang *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  name="username"
                  required
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">No. Telepon *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* ── Shipping address ──────────────────────────────── */}
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Alamat Pengiriman</h2>
              <p className="text-sm text-muted-foreground">
                Digunakan untuk estimasi ongkos kirim JNE dan pengiriman pesanan.
              </p>

              <div className="space-y-2">
                <Label htmlFor="address1">Alamat Jalan *</Label>
                <Input
                  id="address1"
                  name="address1"
                  required
                  placeholder="Nama jalan, nomor rumah, RT/RW, blok"
                  value={formData.address1}
                  onChange={handleChange}
                />
              </div>

              <AddressSelector
                value={formData.wilayah}
                onChange={(wilayah) =>
                  setFormData((prev) => ({ ...prev, wilayah }))
                }
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftar…
                </>
              ) : (
                "Buat Akun"
              )}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
