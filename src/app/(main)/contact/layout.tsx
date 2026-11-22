import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Sanskriti Sarees Mill",
  description: "Get in touch with Sanskriti Sarees Mill located at Shahdara, Delhi. Email us for saree inquiries, order tracking, and support.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
