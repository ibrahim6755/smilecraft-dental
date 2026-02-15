import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Smile, Home, Briefcase, MessageSquare, Info } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-dental-gray-200 bg-dental-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-dental-primary to-dental-primary-dark text-white shadow-md shadow-dental-primary/30">
                <Smile className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-dental-gray-900">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-2 text-xs text-dental-gray-600">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-dental-gray-800">
              Links
            </h3>
            <ul className="mt-2 space-y-1">
              {siteConfig.navLinks.map((link) => {
                const getIcon = () => {
                  if (link.href === "/") return <Home className="h-3 w-3" />;
                  if (link.href === "/about") return <Info className="h-3 w-3" />;
                  if (link.href === "/services") return <Briefcase className="h-3 w-3" />;
                  if (link.href === "/contact") return <MessageSquare className="h-3 w-3" />;
                  return null;
                };
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-xs text-dental-gray-600 transition-colors hover:text-dental-primary"
                    >
                      <span className="text-dental-primary">{getIcon()}</span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-dental-gray-800">
              Contact
            </h3>
            <ul className="mt-2 space-y-1 text-xs text-dental-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-dental-primary" aria-hidden />
                <span>{siteConfig.footer.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3 w-3 shrink-0 text-dental-primary" aria-hidden />
                <a
                  href={`tel:${siteConfig.footer.phone.replace(/\D/g, "")}`}
                  className="transition-colors hover:text-dental-primary"
                >
                  {siteConfig.footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3 w-3 shrink-0 text-dental-primary" aria-hidden />
                <a
                  href={`mailto:${siteConfig.footer.email}`}
                  className="transition-colors hover:text-dental-primary"
                >
                  {siteConfig.footer.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-3 w-3 shrink-0 text-dental-primary" aria-hidden />
                <span>{siteConfig.footer.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-dental-gray-200 pt-4 text-center text-xs text-dental-gray-500">
          © {currentYear} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
