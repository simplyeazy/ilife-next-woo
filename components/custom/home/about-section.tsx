import Link from "next/link";
import { Check } from "lucide-react";
import { getAboutData } from "@/lib/custom/about";

export async function AboutSection() {
  const data = await getAboutData();
  if (!data) return null;

  return (

    <section>
      <div className="max-w-5xl mx-auto px-6">
        {/* Centered heading with separator */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-normal text-gray-800 dark:text-gray-100 mb-4">
            {data.title}
          </h2>
          <hr className="w-12 border-t-2 border-gray-400 dark:border-gray-500 mx-auto" />
        </div>

        {/* Two-column body */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: intro + checkmarks */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
             {data.paragraph_1}
            </p>
            <ul className="space-y-4">
              {data.highlights.map((line, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: company description + CTA */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-8">{data.paragraph_2}</p>
            <Link
              href={data.button_url}
              className="inline-block border border-[#1565C0] dark:border-blue-400 text-[#1565C0] dark:text-blue-400 hover:bg-[#1565C0] dark:hover:bg-blue-400 hover:text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors duration-200"
            >
              {data.button_text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}