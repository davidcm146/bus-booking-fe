import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppProviders } from "@/components/common/AppProviders";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const MANROPE = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://busgo.app"),
  title: {
    default: "BusGo — Travel Vietnam by bus",
    template: "%s | BusGo",
  },
  description:
    "Search and book intercity bus tickets across Vietnam. From Hà Nội to Sài Gòn — comfortable sleeper coaches, honest prices in VND, and the seat you actually picked.",
  keywords: [
    "Vietnam bus",
    "bus tickets Vietnam",
    "intercity bus Vietnam",
    "Hà Nội to Sài Gòn bus",
    "sleeper coach Vietnam",
    "Phương Trang",
    "Hoàng Yến",
    "Mai Linh",
    "Kumho Express",
    "bus booking Vietnam",
  ],
  authors: [{ name: "BusGo" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: { rel: "manifest", url: "/site.webmanifest" },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "BusGo",
    title: "BusGo — Travel Vietnam by bus",
    description:
      "Search and book intercity bus tickets across Vietnam. Honest prices, sleeper coaches, and the seat you actually picked.",
    images: [
      {
        url: "/og-image.gif",
        width: 1200,
        height: 630,
        alt: "BusGo — Travel Vietnam by bus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BusGo — Travel Vietnam by bus",
    description:
      "Search and book intercity bus tickets across Vietnam. Honest prices, sleeper coaches, and the seat you actually picked.",
    images: ["/og-image.gif"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${MANROPE.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <ThemeProvider>
          <AppProviders>
            <AuthProvider>
              <BookingProvider>
                <Header />
                <main id="main-content" className="flex-1">{children}</main>
                <Footer />
              </BookingProvider>
            </AuthProvider>
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
