import Link from "next/link";

// CUSTOM: rewritten to match original ilife.co.id about section layout
const highlights = [
  "Berpengalaman lebih dari 4 tahun dengan klien yang tersebar di nusantara.",
  "Produk yang bergaransi 3 tahun.",
  "Kualitas produk terjamin.",
];

export function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Centered heading with separator */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-normal text-gray-800 mb-4">
            Tentang kami
          </h2>
          <hr className="w-12 border-t-2 border-gray-400 mx-auto" />
        </div>

        {/* Two-column body */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: intro + checkmarks */}
          <div>
            <p className="text-gray-700 mb-6">
              Mengapa anda harus memilih kami sebagai mitra dalam kebutuhan
              pertunjukan publik maupun periklanan videotron anda?
            </p>
            <ul className="space-y-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  {/* Blue check icon */}
                  <svg
                    className="w-5 h-5 text-blue-500 mt-0.5 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: company description + CTA */}
          <div>
            <p className="text-gray-700 mb-4">
              CV. Anugerah Terang Dunia telah berpengalaman selama lebih dari
              empat tahun dalam bidang pertunjukkan dan periklanan dengan media
              layar LED atau dikenal dengan istilah videotron.
            </p>
            <p className="text-gray-700 mb-8">
              Puluhan klien puas dengan produk-produk kami diantaranya Polda
              Kaltara, Dukcapil Kota Salatiga, Pemerintah Kabupaten Blora,
              Gereja Bethany dan masih banyak lainnya.
            </p>
            <Link
              href="/tentang-kami"
              className="inline-block border border-[#17a2b8] text-[#17a2b8] hover:bg-[#17a2b8] hover:text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors duration-200"
            >
              Pelajari lebih lanjut
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
