export const siteConfig = {
  name: "SmileCraft Dental",
  description: "Your smile, our craft. Quality dental care for the whole family.",
  navLinks: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ],
  navCta: { href: "/contact", label: "Book Appointment" },
  footer: {
    address: "123 Dental Way, Care City",
    phone: "(555) 123-4567",
    email: "hello@smilecraftdental.com",
    hours: "Mon–Fri: 8am–6pm, Sat: 9am–2pm",
  },
  contact: {
    address: "123 Dental Way, Care City",
    phone: "(555) 123-4567",
    email: "hello@smilecraftdental.com",
    openingHours: [
      { days: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
      { days: "Saturday", time: "9:00 AM – 2:00 PM" },
      { days: "Sunday", time: "Closed" },
    ],
  },
} as const;
