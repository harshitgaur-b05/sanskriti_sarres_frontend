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
  title: {
    default: "Sanskriti Sarees Mill | Heritage Editorial",
    template: "%s | Sanskriti Sarees Mill"
  },
  description: "Archival heritage meets modern drape. Discover curated timeless silhouettes and pure silk sarees at Sanskriti Sarees Mill.",
  keywords: ["Sarees", "Silk Sarees", "Indian Ethnic Wear", "Sanskriti Sarees Mill", "Unstitched Sarees", "Heritage Drape"],
  openGraph: {
    title: "Sanskriti Sarees Mill",
    description: "Archival heritage meets modern drape. Discover curated timeless silhouettes.",
    url: "https://sanskritisarees.com",
    siteName: "Sanskriti Sarees Mill",
    images: [
      {
        url: "/logo.png", // Assuming logo is in public dir
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
    description: "Archival heritage meets modern drape. Discover curated timeless silhouettes.",
    images: ["/logo.png"],
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
