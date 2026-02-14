import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  Package,
  Sparkles,
  HeartPulse,
  Layers,
  Move,
  CalendarPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Services | SmileCraft Dental",
  description:
    "Comprehensive dental services including cleanings, fillings, whitening, orthodontics, and more.",
};

const services: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "General Checkups & Cleanings",
    description:
      "Regular exams and professional cleanings to keep your teeth and gums healthy and prevent issues before they start.",
    icon: CalendarCheck,
  },
  {
    title: "Fillings & Restorations",
    description:
      "Tooth-colored fillings and restorations that blend naturally and restore function and appearance.",
    icon: Package,
  },
  {
    title: "Teeth Whitening",
    description:
      "Safe, effective whitening options to brighten your smile in-office or with take-home kits.",
    icon: Sparkles,
  },
  {
    title: "Root Canal Therapy",
    description:
      "Comfortable root canal treatment to save infected teeth and relieve pain while preserving your natural smile.",
    icon: HeartPulse,
  },
  {
    title: "Crowns & Bridges",
    description:
      "Custom crowns and bridges to restore damaged or missing teeth with durable, natural-looking results.",
    icon: Layers,
  },
  {
    title: "Orthodontics",
    description:
      "Traditional braces and clear aligner options to straighten teeth and improve bite for all ages.",
    icon: Move,
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-dental-white">
      <section className="bg-dental-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-dental-gray-900 sm:text-4xl md:text-5xl">
              Our <span className="text-dental-primary">Services</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-dental-gray-600">
              From routine care to advanced treatments, we offer a full range of
              dental services to keep your smile healthy and confident.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <FadeIn key={service.title} delay={i * 0.08}>
                <article
                  className="rounded-xl border border-dental-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-dental-primary/10 text-dental-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-dental-gray-900">
                    {service.title}
                  </h2>
                  <p className="mt-2 text-dental-gray-600">{service.description}</p>
                </article>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-dental-primary px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-dental-primary-dark"
            >
              <CalendarPlus className="h-5 w-5" aria-hidden />
              Book an Appointment
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
