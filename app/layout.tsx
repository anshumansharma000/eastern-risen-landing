import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Eastern Risen | Journeys that bring you closer",
    template: "%s | Eastern Risen",
  },
  description:
    "Private and small-group journeys across India and its neighbouring lands, designed with local knowledge and personal care.",
  metadataBase: new URL("https://easternrisen.com"),
  openGraph: {
    title: "Eastern Risen | Journeys that bring you closer",
    description:
      "Distinctive private and small-group journeys, rooted in Odisha and reaching across India and its neighbouring lands.",
    type: "website",
    locale: "en_IN",
    siteName: "Eastern Risen",
    images: [
      {
        url: "/og.png",
        width: 1730,
        height: 909,
        alt: "Eastern Risen, journeys that bring you closer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eastern Risen | Journeys that bring you closer",
    description:
      "Distinctive journeys designed with local knowledge and personal care.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
