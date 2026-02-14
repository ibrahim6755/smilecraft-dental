export const siteConfig = {
  name: "SmileCraft Dental",
  description: "Experience quality dental care in a modern, welcoming environment. Our team is dedicated to keeping your smile healthy and confident.",
  url: "https://smilecraftdental.com",
  ogImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
  links: {
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
};

export const defaultMetadata = {
  title: {
    default: "SmileCraft Dental - Quality Dental Care",
    template: "%s | SmileCraft Dental",
  },
  description: siteConfig.description,
  keywords: ["dental", "dentist", "teeth cleaning", "implants", "braces", "root canal", "whitening"],
  authors: [{ name: "SmileCraft Dental" }],
  creator: "SmileCraft Dental",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@smilecraftdental",
  },
};
