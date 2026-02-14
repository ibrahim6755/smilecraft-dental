import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-dental-gray-200 bg-dental-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-lg font-semibold text-dental-primary"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-2 text-sm text-dental-gray-600">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-dental-gray-800">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dental-gray-600 transition-colors hover:text-dental-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-dental-gray-800">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-dental-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-dental-primary" aria-hidden />
                <span>{siteConfig.footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-dental-primary" aria-hidden />
                <a
                  href={`tel:${siteConfig.footer.phone.replace(/\D/g, "")}`}
                  className="transition-colors hover:text-dental-primary"
                >
                  {siteConfig.footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-dental-primary" aria-hidden />
                <a
                  href={`mailto:${siteConfig.footer.email}`}
                  className="transition-colors hover:text-dental-primary"
                >
                  {siteConfig.footer.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-dental-primary" aria-hidden />
                <span>{siteConfig.footer.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-dental-gray-200 pt-8 text-center text-sm text-dental-gray-500">
          © {currentYear} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
