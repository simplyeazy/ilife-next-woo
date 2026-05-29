// CUSTOM: redesigned footer to match iLife branding
import Link from "next/link";
import { ILifeLogo } from "@/components/custom/ilife-logo";

const tautan = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Layanan", href: "/penyewaan" },
  { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
];

const layanan = [
  { label: "Videotron", href: "/produk" },
  { label: "Running Text", href: "/produk" },
  { label: "Penyewaan", href: "/penyewaan" },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main footer columns */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10">
        {/* Company info */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="mb-1">
            <ILifeLogo className="text-2xl" />
          </Link>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="font-semibold text-gray-800">CV. Anugerah Terang Dunia</p>
            <p>Jl. Kol. Sunandar No. 31</p>
            <p>Blora, Jawa Tengah 58214</p>
            <p>Indonesia</p>
          </div>
          <div className="text-sm text-gray-700 flex flex-col gap-1 mt-1">
            <p><span className="font-semibold">Kantor:</span>{" "}<a href={`tel:${process.env.NEXT_PUBLIC_PHONE_OFFICE}`} className="text-[#1565C0] hover:underline">{process.env.NEXT_PUBLIC_PHONE_OFFICE}</a></p>
            <p><span className="font-semibold">WhatsApp:</span>{" "}<a href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/\D/g, '')}`} className="text-[#1565C0] hover:underline">{process.env.NEXT_PUBLIC_WA_NUMBER}</a></p>
            <p><span className="font-semibold">Telepon:</span>{" "}<a href={`tel:${process.env.NEXT_PUBLIC_PHONE_MOBILE}`} className="text-[#1565C0] hover:underline">{process.env.NEXT_PUBLIC_PHONE_MOBILE}</a></p>
            <p><span className="font-semibold">Email:</span>{" "}<a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} className="text-[#1565C0] hover:underline">{process.env.NEXT_PUBLIC_EMAIL}</a></p>
          </div>
        </div>

        {/* Tautan */}
        <div className="flex flex-col gap-2">
          <h5 className="font-semibold text-[#1565C0] text-base mb-1">Tautan</h5>
          {tautan.map(({ label, href }) => (
            <Link key={label} href={href} className="text-sm text-gray-700 hover:text-[#1565C0] flex items-center gap-1">
              <span className="text-gray-400">›</span> {label}
            </Link>
          ))}
        </div>

        {/* Layanan Kami */}
        <div className="flex flex-col gap-2">
          <h5 className="font-semibold text-[#1565C0] text-base mb-1">Layanan Kami</h5>
          {layanan.map(({ label, href }) => (
            <Link key={label} href={href} className="text-sm text-gray-700 hover:text-[#1565C0] flex items-center gap-1">
              <span className="text-gray-400">›</span> {label}
            </Link>
          ))}
        </div>

        {/* TODO */}
        {/* Bergabung buletin */}
        {/* <div className="flex flex-col gap-2">
          <h5 className="font-semibold text-[#1565C0] text-base mb-1">Bergabung buletin kami</h5>
          <p className="text-sm text-gray-600 leading-relaxed">
            Mari berlangganan buletin promosi kami dengan menghubungi kami untuk mendapatkan tawaran terbaik
          </p>
        </div> */}
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-gray-600">
            &copy; <span className="font-medium">CV. Anugerah Terang Dunia</span>. Hak cipta dilindungi undang-undang
          </p>
          <div className="flex items-center gap-3">
             <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/\D/g, '')}`} aria-label="WhatsApp" className="text-gray-500 hover:text-[#1565C0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.549 4.12 1.508 5.863L0 24l6.335-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.016-1.374l-.36-.214-3.73.86.878-3.63-.234-.373A9.797 9.797 0 0 1 2.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/></svg>
            </a>
            <a href={`https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM}`} aria-label="Instagram" className="text-gray-500 hover:text-[#1565C0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
           
            <a href={`https://facebook.com/${process.env.NEXT_PUBLIC_FACEBOOK}`} aria-label="Facebook" className="text-gray-500 hover:text-[#1565C0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.676V1.325C24 .593 23.407 0 22.675 0z"/></svg>
            </a>
            <a href={`https://tiktok.com/@${process.env.NEXT_PUBLIC_TIKTOK}`} aria-label="TikTok" className="text-gray-500 hover:text-[#1565C0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.42 4.398 9.818 9.818 9.818 5.42 0 9.818-4.398 9.818-9.818 0-5.42-4.398-9.818-9.818-9.818zm0 18.636c-4.82 0-8.818-3.998-8.818-8.818S7.18 1 12 1s8.818 3.998 8.818 8.818-3.998 8.818-8.818 8.818z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
