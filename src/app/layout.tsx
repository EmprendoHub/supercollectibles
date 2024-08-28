import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderComponent from "@/components/headers/HeaderComponent";
import { ThemeProvider } from "next-themes";
import FooterComponent from "@/components/layouts/FooterComponent";
import CookieConsentComponent from "./(home)/_components/CookieConsentComponent";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Super Collectibles Mx",
  description:
    "Expertos en artículos deportivos y cartas de juego coleccionable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <GoogleAnalytics gaId="G-0FJ701YCLD" />
      <body className="max-w-full body-class overscroll-x-none overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* <HeaderComponent /> */}
          {children}
          {/* <FooterComponent /> */}
          {/* <CookieConsentComponent /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
