import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sanskriti-sarres-frontend.vercel.app"),
  title: {
    default: "Sanskriti Sarees Mill | Traditional & Bridal Sarees",
    template: "%s | Sanskriti Sarees Mill",
  },
  description:
    "Sanskriti Sarees Mill is a local saree retail shop based in Shahdara, Delhi. Discover curated traditional sarees, bridal collections, and ethnic drapes.",
  keywords: [
    "Sanskriti Sarees Mill",
    "Sarees Delhi",
    "Shahdara Saree Shop",
    "Silk Sarees",
    "Bridal Sarees",
    "Indian Ethnic Wear",
    "Unstitched Sarees",
  ],
  openGraph: {
    title: "Sanskriti Sarees Mill | Shahdara, Delhi",
    description:
      "Local saree retail shop based in Shahdara, Delhi offering curated traditional and bridal sarees.",
    url: "https://sanskriti-sarres-frontend.vercel.app",
    siteName: "Sanskriti Sarees Mill",
    images: [
      {
        url: "/logo_sanskriti.webp",
        width: 1200,
        height: 630,
        alt: "Sanskriti Sarees Mill Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanskriti Sarees Mill",
    description:
      "Local saree retail shop based in Shahdara, Delhi offering curated traditional and bridal sarees.",
    images: ["/logo_sanskriti.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-body-md bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
