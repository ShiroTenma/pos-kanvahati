import { Inter } from "next/font/google";
import "./globals.css"; // <--- INI WAJIB ADA
import Sidebar from "@/components/Sidebar"; // Import Sidebar

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "POS Kanva Hati",
  description: "Point of Sale System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        {/* Layout Flex: Sidebar di kiri, Konten di kanan */}
        <div className="flex h-screen overflow-hidden bg-base-200">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
      </body>
    </html>
  );
}