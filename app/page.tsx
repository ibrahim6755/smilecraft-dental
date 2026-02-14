"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarPlus,
  ChevronRight,
  ChevronDown,
  Phone,
  Users,
  Sparkles,
  Heart,
  Droplets,
  Sun,
  Layers,
  Move,
  HeartPulse,
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { useAppointment } from "@/lib/AppointmentContext";

const services: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Teeth Cleaning",
    description:
      "Professional cleanings to remove plaque and tartar, keeping your gums healthy and your smile bright.",
    icon: Droplets,
  },
  {
    title: "Whitening",
    description:
      "Safe, effective whitening treatments to restore natural brightness and boost your confidence.",
    icon: Sun,
  },
  {
    title: "Dental Implants",
    description:
      "Permanent tooth replacement that looks and feels natural, restoring function and aesthetics.",
    icon: Layers,
  },
  {
    title: "Braces",
    description:
      "Traditional and clear options to straighten teeth and correct bite for a lasting, healthy smile.",
    icon: Move,
  },
  {
    title: "Root Canal",
    description:
      "Comfortable treatment to save infected teeth, relieve pain, and preserve your natural smile.",
    icon: HeartPulse,
  },
  {
    title: "Cosmetic Dentistry",
    description:
      "Veneers, bonding, and smile design to enhance the appearance of your teeth and overall smile.",
    icon: Palette,
  },
];

export default function Home() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { openModal } = useAppointment();

  return (
    <div className="bg-dental-white">
      {/* Hero */}
      <section className="relative overflow-hiddens">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            {/* Left: content */}
            <FadeIn className="order-2 lg:order-1" duration={0.5} y={16}>
              <h1 className="text-4xl font-bold tracking-tight text-dental-gray-900 sm:text-5xl lg:text-[2.75rem] xl:text-6xl">
                Your Smile,{" "}
                <span className="text-dental-primary">Our Priority</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-dental-gray-600 sm:text-xl">
                Experience quality dental care in a modern, welcoming environment.
                Our team is dedicated to keeping your smile healthy and
                confident—from routine checkups to advanced treatments.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={openModal}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-dental-primary px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-dental-primary/30 transition-colors hover:bg-dental-primary-dark hover:shadow-lg hover:shadow-dental-primary/25 focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-2 focus:ring-offset-white cursor-pointer"
                >
                  <CalendarPlus className="h-5 w-5" aria-hidden />
                  Book Appointment
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-dental-gray-300 bg-white px-6 py-3.5 text-base font-semibold text-dental-gray-700 transition-colors hover:border-dental-primary hover:bg-dental-gray-50 hover:text-dental-primary focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-2 focus:ring-offset-white"
                >
                  <Phone className="h-5 w-5" aria-hidden />
                  Contact Us
                </Link>
              </div>
            </FadeIn>

            {/* Right: image */}
            <FadeIn className="relative order-1 lg:order-2" delay={0.1} duration={0.5} y={16}>
            <div className="aspect-4/3 overflow-hidden rounded-2xl bg-dental-gray-200 shadow-lg lg:aspect-5/4">
              <Image
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
                alt="Modern dental clinic with professional care"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-2xl"
                priority
              />
            </div>
            </FadeIn>
          </div>
        </div>
      </section>

       {/* Features / Trust strip */}
      <section className="border-t border-dental-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-3">
            <FadeIn className="flex flex-col items-center" delay={0}>
            <div className="flex flex-col items-center transition-transform duration-300 ease-out hover:scale-105">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dental-primary/10 text-dental-primary">
                <Users className="h-6 w-6" aria-hidden />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-dental-gray-900">
                Experienced Team
              </h2>
              <p className="mt-1 text-dental-gray-600">
                Licensed professionals dedicated to your oral health.
              </p>
            </div>
            </FadeIn>
            <FadeIn className="flex flex-col items-center" delay={0.1}>
            <div className="flex flex-col items-center transition-transform duration-300 ease-out hover:scale-105">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dental-primary/10 text-dental-primary">
                <Sparkles className="h-6 w-6" aria-hidden />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-dental-gray-900">
                Modern Technology
              </h2>
              <p className="mt-1 text-dental-gray-600">
                Up-to-date equipment and techniques for better outcomes.
              </p>
            </div>
            </FadeIn>
            <FadeIn className="flex flex-col items-center sm:col-span-2 lg:col-span-1" delay={0.2}>
            <div className="flex flex-col items-center transition-transform duration-300 ease-out hover:scale-105">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dental-primary/10 text-dental-primary">
                <Heart className="h-6 w-6" aria-hidden />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-dental-gray-900">
                Comfort First
              </h2>
              <p className="mt-1 text-dental-gray-600">
                A calm, clean environment so you feel at ease.
              </p>
            </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-dental-gray-200 bg-dental-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-dental-gray-900 sm:text-4xl">
              Our <span className="text-dental-primary">Services</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-dental-gray-600">
              Comprehensive care for every smile—from routine cleanings to
              advanced treatments.
            </p>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <FadeIn key={service.title} delay={i * 0.08} duration={0.4}>
                <article
                  className="group relative flex h-full flex-col rounded-2xl border border-dental-gray-200 bg-white p-8 shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:border-dental-primary hover:shadow-dental-primary/20 sm:p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-dental-primary/10 text-dental-primary transition-colors duration-300 group-hover:bg-dental-primary group-hover:text-white">
                    <Icon className="h-7 w-7" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-dental-gray-900">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-dental-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-dental-primary font-medium group-hover:gap-3 transition-all">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </div>
                </article>
                </FadeIn>
              );
            })}
          </div>
          <FadeIn className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-dental-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-dental-primary-dark"
            >
              View All Services
              <ChevronRight className="h-5 w-5" aria-hidden />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="border-t border-dental-gray-200 bg-dental-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-dental-gray-900 sm:text-4xl">
              Meet Our <span className="text-dental-primary">Professional Team</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-dental-gray-600">
              Experienced dental professionals dedicated to providing you with the highest quality care
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Dr. Sarah Johnson", title: "Lead Dentist", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80" },
              { name: "Dr. Michael Chen", title: "Orthodontist", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80" },
              { name: "Emma Rodriguez", title: "Dental Hygienist", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=80" },
              { name: "James Wilson", title: "Dental Assistant", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80" },
            ].map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1} duration={0.4}>
                <div className="group flex flex-col items-center text-center">
                  <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-2xl shadow-lg">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-dental-gray-900">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-dental-primary font-medium">
                    {member.title}
                  </p>
                  <p className="mt-3 text-sm text-dental-gray-600 leading-relaxed">
                    Committed to providing exceptional dental care and patient experience
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-12 text-center">
            <p className="text-lg text-dental-gray-600">
              Our team members are highly trained professionals with years of experience in dental care
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-dental-gray-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-dental-gray-900 sm:text-4xl">
              Frequently Asked <span className="text-dental-primary">Questions</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-dental-gray-600">
              Find answers to common questions about our services and appointment process
            </p>
          </FadeIn>

          <div className="mt-12 space-y-4">
            {[
              {
                question: "How do I book an appointment?",
                answer: "You can book an appointment by clicking the 'Book Appointment' button on our website or by calling us directly. Our online booking system is available 24/7 for your convenience.",
              },
              {
                question: "What should I bring to my first appointment?",
                answer: "Please bring a valid ID, your dental insurance card (if applicable), and any relevant medical history. Arriving 10 minutes early helps us process your information efficiently.",
              },
              {
                question: "Do you offer emergency dental services?",
                answer: "Yes, we provide emergency dental services for urgent issues like severe pain, broken teeth, or infections. Contact us immediately if you experience a dental emergency.",
              },
              
            ].map((faq, index) => (
              <FadeIn key={index} delay={index * 0.05} duration={0.3}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full rounded-lg border border-dental-gray-200 bg-white p-6 text-left transition-all hover:border-dental-primary hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-dental-gray-900">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-dental-primary transition-transform duration-300 ${
                        expandedFAQ === index ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </div>
                  {expandedFAQ === index && (
                    <p className="mt-4 text-dental-gray-600">
                      {faq.answer}
                    </p>
                  )}
                </button>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-12 rounded-lg bg-dental-gray-50 p-8 text-center">
            <p className="text-lg text-dental-gray-900 font-semibold">
              Can't find what you're looking for?
            </p>
            <p className="mt-2 text-dental-gray-600">
              Contact us directly and our team will be happy to help answer any additional questions.
            </p>
            <button
              onClick={openModal}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-dental-primary px-6 py-3 text-base font-semibold text-white shadow-md shadow-dental-primary/30 transition-colors hover:bg-dental-primary-dark hover:shadow-lg hover:shadow-dental-primary/25"
            >
              <Phone className="h-5 w-5" aria-hidden />
              Contact Us
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="border-t border-dental-gray-200 bg-dental-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-dental-gray-900 sm:text-4xl">
              What Our <span className="text-dental-primary">Patients Say</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-dental-gray-600">
              Real stories from happy patients who trust us with their smile
            </p>
          </FadeIn>

          <div className="mt-12 overflow-hidden">
            <div className="group flex animate-scroll space-x-6 hover:[animation-play-state:paused]">
              {[
                {
                  name: "Sarah Mitchell",
                  role: "Teacher",
                  text: "Amazing experience! The team is professional, friendly, and made me feel completely comfortable. My teeth have never looked better.",
                  rating: 5,
                },
                {
                  name: "John Davis",
                  role: "Business Owner",
                  text: "Best dental care I've received. Clean facility, quick appointments, and excellent results. Highly recommend!",
                  rating: 5,
                },
                {
                  name: "Emily Rodriguez",
                  role: "Healthcare Professional",
                  text: "Dr. Sarah is incredibly skilled and attentive to detail. The entire team goes above and beyond to ensure patient satisfaction.",
                  rating: 5,
                },
                {
                  name: "Michael Chen",
                  role: "Software Engineer",
                  text: "I was nervous about my procedure, but the staff's care and expertise put me at ease immediately. Great results!",
                  rating: 5,
                },
                {
                  name: "Jessica Thompson",
                  role: "Nurse",
                  text: "Professional, painless, and they actually explain everything they're doing. This is my go-to dental clinic.",
                  rating: 5,
                },
                {
                  name: "Robert Wilson",
                  role: "Entrepreneur",
                  text: "Exceptional service from start to finish. The clinic is state-of-the-art and the team is genuinely caring.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="w-80 shrink-0 rounded-2xl border border-dental-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-dental-primary sm:w-96"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-dental-primary text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-dental-gray-700 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-dental-gray-100 pt-4">
                    <p className="font-semibold text-dental-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-dental-primary">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                {
                  name: "Sarah Mitchell",
                  role: "Teacher",
                  text: "Amazing experience! The team is professional, friendly, and made me feel completely comfortable. My teeth have never looked better.",
                  rating: 5,
                },
                {
                  name: "John Davis",
                  role: "Business Owner",
                  text: "Best dental care I've received. Clean facility, quick appointments, and excellent results. Highly recommend!",
                  rating: 5,
                },
                {
                  name: "Emily Rodriguez",
                  role: "Healthcare Professional",
                  text: "Dr. Sarah is incredibly skilled and attentive to detail. The entire team goes above and beyond to ensure patient satisfaction.",
                  rating: 5,
                },
                {
                  name: "Michael Chen",
                  role: "Software Engineer",
                  text: "I was nervous about my procedure, but the staff's care and expertise put me at ease immediately. Great results!",
                  rating: 5,
                },
                {
                  name: "Jessica Thompson",
                  role: "Nurse",
                  text: "Professional, painless, and they actually explain everything they're doing. This is my go-to dental clinic.",
                  rating: 5,
                },
                {
                  name: "Robert Wilson",
                  role: "Entrepreneur",
                  text: "Exceptional service from start to finish. The clinic is state-of-the-art and the team is genuinely caring.",
                  rating: 5,
                },
                
              ].map((testimonial, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="w-80 shrink-0 rounded-2xl border border-dental-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-dental-primary sm:w-96"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-dental-primary text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-dental-gray-700 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-dental-gray-100 pt-4">
                    <p className="font-semibold text-dental-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-dental-primary">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

     


    </div>
  );
}
