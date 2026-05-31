"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Province {
  Id: string;
  Name: string;
}
interface City {
  Id: string;
  ProvinceId: string;
  Name: string;
}
interface District {
  Id: string;
  CityRegencyId: string;
  Name: string;
}
interface Village {
  Id: string;
  Name: string;
  DistrictId: string;
  PostalCode: string;
}

export interface WilayahAddress {
  /** WooCommerce `state` field — province name, e.g. "JAWA BARAT" */
  provinceName: string;
  provinceId: string;
  /** WooCommerce `city` field — city/regency name, e.g. "KAB. BOGOR" (used by JNE plugin) */
  cityName: string;
  cityId: string;
  /** Appended to address_2 */
  districtName: string;
  districtId: string;
  /** Appended to address_2 */
  villageName: string;
  villageId: string;
  /** Auto-filled from village data → WooCommerce `postcode` */
  postcode: string;
}

export const EMPTY_WILAYAH: WilayahAddress = {
  provinceName: "",
  provinceId: "",
  cityName: "",
  cityId: "",
  districtName: "",
  districtId: "",
  villageName: "",
  villageId: "",
  postcode: "",
};

interface Props {
  value: WilayahAddress;
  onChange: (address: WilayahAddress) => void;
  /** If true, all selects are required */
  required?: boolean;
  disabled?: boolean;
}

// ─── Fetch helpers ─────────────────────────────────────────────────────────────

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json() as Promise<T>;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function AddressSelector({ value, onChange, required = false, disabled = false }: Props) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  // Load provinces once
  useEffect(() => {
    setLoadingProvinces(true);
    fetchJSON<Province[]>("/api/wilayah/provinces")
      .then(setProvinces)
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Load cities when province changes
  useEffect(() => {
    if (!value.provinceId) { setCities([]); return; }
    setLoadingCities(true);
    fetchJSON<City[]>(`/api/wilayah/cities/${value.provinceId}`)
      .then(setCities)
      .finally(() => setLoadingCities(false));
  }, [value.provinceId]);

  // Load districts when city changes
  useEffect(() => {
    if (!value.cityId) { setDistricts([]); return; }
    setLoadingDistricts(true);
    fetchJSON<District[]>(`/api/wilayah/districts/${value.cityId}`)
      .then(setDistricts)
      .finally(() => setLoadingDistricts(false));
  }, [value.cityId]);

  // Load villages when district changes
  useEffect(() => {
    if (!value.districtId) { setVillages([]); return; }
    setLoadingVillages(true);
    fetchJSON<Village[]>(`/api/wilayah/villages/${value.districtId}`)
      .then(setVillages)
      .finally(() => setLoadingVillages(false));
  }, [value.districtId]);

  const handleProvince = useCallback((provinceId: string) => {
    const province = provinces.find((p) => p.Id === provinceId);
    onChange({
      ...EMPTY_WILAYAH,
      provinceId,
      provinceName: province?.Name ?? "",
    });
  }, [provinces, onChange]);

  const handleCity = useCallback((cityId: string) => {
    const city = cities.find((c) => c.Id === cityId);
    onChange({
      ...value,
      cityId,
      cityName: city?.Name ?? "",
      districtId: "",
      districtName: "",
      villageId: "",
      villageName: "",
      postcode: "",
    });
  }, [cities, value, onChange]);

  const handleDistrict = useCallback((districtId: string) => {
    const district = districts.find((d) => d.Id === districtId);
    onChange({
      ...value,
      districtId,
      districtName: district?.Name ?? "",
      villageId: "",
      villageName: "",
      postcode: "",
    });
  }, [districts, value, onChange]);

  const handleVillage = useCallback((villageId: string) => {
    const village = villages.find((v) => v.Id === villageId);
    onChange({
      ...value,
      villageId,
      villageName: village?.Name ?? "",
      postcode: village?.PostalCode ?? "",
    });
  }, [villages, value, onChange]);

  return (
    <div className="space-y-4">
      {/* Province */}
      <div className="space-y-2">
        <Label htmlFor="province">
          Provinsi {required && <span className="text-destructive">*</span>}
        </Label>
        <SelectWithLoader
          id="province"
          placeholder="Pilih Provinsi"
          loading={loadingProvinces}
          disabled={disabled}
          value={value.provinceId}
          onValueChange={handleProvince}
          required={required}
        >
          {provinces.map((p) => (
            <SelectItem key={p.Id} value={p.Id}>
              {toTitleCase(p.Name)}
            </SelectItem>
          ))}
        </SelectWithLoader>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">
          Kabupaten / Kota {required && <span className="text-destructive">*</span>}
        </Label>
        <SelectWithLoader
          id="city"
          placeholder={value.provinceId ? "Pilih Kabupaten/Kota" : "Pilih Provinsi terlebih dahulu"}
          loading={loadingCities}
          disabled={disabled || !value.provinceId}
          value={value.cityId}
          onValueChange={handleCity}
          required={required}
        >
          {cities.map((c) => (
            <SelectItem key={c.Id} value={c.Id}>
              {toTitleCase(c.Name)}
            </SelectItem>
          ))}
        </SelectWithLoader>
      </div>

      {/* District */}
      <div className="space-y-2">
        <Label htmlFor="district">
          Kecamatan {required && <span className="text-destructive">*</span>}
        </Label>
        <SelectWithLoader
          id="district"
          placeholder={value.cityId ? "Pilih Kecamatan" : "Pilih Kabupaten/Kota terlebih dahulu"}
          loading={loadingDistricts}
          disabled={disabled || !value.cityId}
          value={value.districtId}
          onValueChange={handleDistrict}
          required={required}
        >
          {districts.map((d) => (
            <SelectItem key={d.Id} value={d.Id}>
              {toTitleCase(d.Name)}
            </SelectItem>
          ))}
        </SelectWithLoader>
      </div>

      {/* Village */}
      <div className="space-y-2">
        <Label htmlFor="village">
          Kelurahan / Desa {required && <span className="text-destructive">*</span>}
        </Label>
        <SelectWithLoader
          id="village"
          placeholder={value.districtId ? "Pilih Kelurahan/Desa" : "Pilih Kecamatan terlebih dahulu"}
          loading={loadingVillages}
          disabled={disabled || !value.districtId}
          value={value.villageId}
          onValueChange={handleVillage}
          required={required}
        >
          {villages.map((v) => (
            <SelectItem key={v.Id} value={v.Id}>
              {toTitleCase(v.Name)}
            </SelectItem>
          ))}
        </SelectWithLoader>
      </div>

      {/* Postcode — auto-filled, but user can still edit */}
      <div className="space-y-2">
        <Label htmlFor="postcode">
          Kode Pos {required && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id="postcode"
          name="postcode"
          placeholder="Otomatis terisi"
          value={value.postcode}
          onChange={(e) => onChange({ ...value, postcode: e.target.value })}
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

// ─── Helper: Select with loading state ────────────────────────────────────────

function SelectWithLoader({
  id,
  placeholder,
  loading,
  disabled,
  value,
  onValueChange,
  required,
  children,
}: {
  id: string;
  placeholder: string;
  loading: boolean;
  disabled: boolean;
  value: string;
  onValueChange: (v: string) => void;
  required: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || loading}
        required={required}
        name={id}
      >
        <SelectTrigger id={id} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Memuat…
            </span>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {children}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Util ──────────────────────────────────────────────────────────────────────

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|\.)\w/g, (c) => c.toUpperCase());
}
