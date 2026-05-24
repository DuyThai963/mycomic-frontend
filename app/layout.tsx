import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import SearchInput from "@/components/SearchInput";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DT MyComic",
  description: "Web đọc truyện tranh siêu nhẹ, siêu mượt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        {/* Navbar */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight shrink-0">
                    DT<span className="text-gray-800">MYCOMIC</span>
                </Link>
                
                {/* Nhét thanh search vào đây */}
                <SearchInput />

                <div className="hidden md:block text-sm text-gray-500 shrink-0">
                    Kho truyện mới nhất
                </div>
            </div>
        </header>
        
        {/* Nội dung chính */}
        <main className="flex-grow">
            {children}
        </main>
      </body>
    </html>
  );
}