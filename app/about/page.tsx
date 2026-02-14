import type { Metadata } from "next";
import Link from "next/link";
import { UserCheck, ShieldCheck, Heart, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "About Us | SmileCraft Dental",
  description:
    "Learn about SmileCraft Dental — our story, values, and commitment to quality dental care.",
};

const values: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Patient-Centered Care",
    description: "We listen to your concerns and tailor treatment to your needs and goals.",
    icon: UserCheck,
  },
  {
    title: "Quality & Safety",
    description: "We follow strict standards and use proven techniques and materials.",
    icon: ShieldCheck,
  },
  {
    title: "Comfort & Trust",
    description: "We create a welcoming environment so you feel at ease every visit.",
    icon: Heart,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-dental-white">
      <section className="bg-dental-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <FadeIn className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-dental-gray-900 sm:text-4xl md:text-5xl">
              About <span className="text-dental-primary">SmileCraft Dental</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-dental-gray-600">
              Your smile is our craft. We are committed to providing exceptional
              dental care in a modern, comfortable setting.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-3xl space-y-6 text-center text-dental-gray-600">
            <p className="text-lg leading-relaxed">
              SmileCraft Dental was founded with a simple mission: to offer
              high-quality, compassionate dental care that puts patients first.
              Our team of experienced professionals stays current with the
              latest techniques and technology so you receive the best possible
              care.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you need a routine cleaning, a cosmetic procedure, or
              more complex treatment, we are here to guide you every step of the
              way. We believe everyone deserves a healthy, confident smile.
            </p>
          </FadeIn>

          <div className="mx-auto mt-16 max-w-5xl">
            <FadeIn>
              <h2 className="text-center text-2xl font-semibold text-dental-gray-900">
                What We Stand For
              </h2>
            </FadeIn>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <FadeIn key={value.title} delay={i * 0.1}>
                  <div
                    className="rounded-xl border border-dental-gray-200 bg-dental-gray-50 p-6 text-center transition-transform duration-300 ease-out hover:scale-[1.02]"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-dental-primary/10 text-dental-primary">
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    <h3 className="mt-3 font-semibold text-dental-primary">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-dental-gray-600">{value.description}</p>
                  </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>

          <FadeIn className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-dental-primary px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-dental-primary-dark"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Get in Touch
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
