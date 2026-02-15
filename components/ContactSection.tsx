import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { FadeIn } from "@/components/FadeIn";

type ContactSectionProps = {
  children?: React.ReactNode;
};

export function ContactSection({ children }: ContactSectionProps) {
  const { address, phone, email, openingHours } = siteConfig.contact;

  return (
    <section className="border-t border-dental-gray-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dental-gray-900 sm:text-4xl">
            Visit <span className="text-dental-primary">Our Clinic</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-dental-gray-600">
            We’re here to help. Find our location, opening hours, and contact
            details below.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Contact details + optional form */}
          <div className="space-y-6 lg:col-span-2">
            <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-dental-gray-200 bg-dental-gray-50/50 p-6 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dental-primary/10 text-dental-primary">
                  <MapPin className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold text-dental-gray-900">Address</h3>
                  <p className="mt-1 text-dental-gray-600">{address}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-dental-primary hover:underline"
                  >
                    Get directions →
                  </a>
                </div>
              </div>
            </div>
            </FadeIn>

            <FadeIn delay={0.15}>
            <div className="rounded-2xl border border-dental-gray-200 bg-dental-gray-50/50 p-6 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dental-primary/10 text-dental-primary">
                  <Phone className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold text-dental-gray-900">Phone</h3>
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="mt-1 block text-dental-gray-600 transition-colors hover:text-dental-primary"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            </div>
            </FadeIn>

            <FadeIn delay={0.2}>
            <div className="rounded-2xl border border-dental-gray-200 bg-dental-gray-50/50 p-6 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dental-primary/10 text-dental-primary">
                  <Mail className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold text-dental-gray-900">Email</h3>
                  <a
                    href={`mailto:${email}`}
                    className="mt-1 block text-dental-gray-600 transition-colors hover:text-dental-primary"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>
            </FadeIn>

            <FadeIn delay={0.25}>
            <div className="rounded-2xl border border-dental-gray-200 bg-dental-gray-50/50 p-6 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dental-primary/10 text-dental-primary">
                  <Clock className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold text-dental-gray-900">
                    Opening Hours
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-dental-gray-600">
                    {openingHours.map((row) => (
                      <li key={row.days} className="flex justify-between gap-4">
                        <span>{row.days}</span>
                        <span className="font-medium text-dental-gray-800">
                          {row.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            </FadeIn>

            {children}
          </div>

          {/* Google Maps embed - Islamabad, Pakistan */}
          <FadeIn delay={0.2} className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-dental-gray-200 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.01]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.8522623440783!2d73.18947!3d33.74049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df96cce1234567%3A0x1234567890abcdef!2sIslamabad%2C%20Pakistan!5e0!3m2!1sen!2s!4v1234567890123"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="SmileCraft Dental Clinic Location - Islamabad, Pakistan"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
