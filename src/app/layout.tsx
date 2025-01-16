import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: "Star Wars Wiki",
  description: "A relief to your Star Wars curiosity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} sm:bg-[#ededed] antialiased custom-scrollbar`}>
        <div className="h-screen flex flex-col gap-[30px]">
          <header className="w-full py-3.5 text-center bg-white shadow-[0_2px_0_0_#0ab463] sm:shadow-[0_2px_0_0_#dadada]">
            <h1 className="font-bold text-lg text-[#0ab463]">SWStarter</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
