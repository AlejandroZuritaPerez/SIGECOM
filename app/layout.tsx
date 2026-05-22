import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
// @ts-ignore
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SIGECOM — Sistema de Gestión Comunitaria",
    template: "%s | SIGECOM",
  },
  description:
    "Plataforma web para que los ciudadanos de Boca del Río, Veracruz, reporten y den seguimiento a problemas comunitarios.",
  keywords: ["municipio", "reportes", "boca del río", "comunidad", "infraestructura"],
  authors: [{ name: "SIGECOM" }],
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster
            richColors
            position="top-right"
          />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}