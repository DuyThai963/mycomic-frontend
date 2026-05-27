import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import SearchInput from "@/components/SearchInput";
import SmartHeader from "@/components/SmartHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DT MyComic",
  description: "Web đọc truyện tranh siêu nhẹ, siêu mượt",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "DT MyComic",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <SmartHeader>
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight shrink-0">
                    DT<span className="text-gray-800">MYCOMIC</span>
                </Link>
                
                {/* Thanh search */}
                <SearchInput />

                <div className="hidden md:block text-sm text-gray-500 shrink-0">
                    Kho truyện mới nhất
                </div>
            </div>
        </SmartHeader>
        
        {/* Nội dung chính */}
        <main className="flex-grow">
            {children}
        </main>
      </body>
    </html>
  );
}