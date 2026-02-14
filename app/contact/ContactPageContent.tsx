"use client";

import { useState } from "react";
import { MessageSquare, CalendarPlus } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { AppointmentModal } from "@/components/AppointmentModal";

export function ContactPageContent() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <section className="bg-linear-to-b from-dental-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          {/* Header */}
          <div className="mb-12 text-center lg:mb-16">
            <FadeIn>
              <h1 className="text-4xl font-bold tracking-tight text-dental-gray-900 sm:text-5xl lg:text-6xl">
                Get in <span className="text-dental-primary">Touch</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-dental-gray-600 sm:text-xl">
                Have questions or ready to book your next appointment? We'd love to hear from you.
              </p>
            </FadeIn>
          </div>

          {/* Info and CTA Grid */}
          <div className="mx-auto grid max-w-3xl gap-12 lg:gap-16">
            {/* Info Section */}
            <FadeIn>
              <div className="space-y-8">
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-dental-gray-900">
                    Ready to Schedule?
                  </h2>
                  <p className="text-lg text-dental-gray-600">
                    Click the button below to book your appointment. We'll confirm your visit by phone or email within 24 hours.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 rounded-lg border border-dental-gray-200 bg-white p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-dental-primary/10 text-dental-primary">
                      <CalendarPlus className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dental-gray-900">Quick Booking</h3>
                      <p className="text-sm text-dental-gray-600">Schedule your appointment in minutes with our easy online form</p>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-lg border border-dental-gray-200 bg-white p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-dental-primary/10 text-dental-primary">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dental-gray-900">Fast Response</h3>
                      <p className="text-sm text-dental-gray-600">We confirm all appointments within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-dental-primary px-8 py-4 text-lg font-semibold text-white shadow-md shadow-dental-primary/30 transition-colors hover:bg-dental-primary-dark hover:shadow-lg hover:shadow-dental-primary/25 focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-2 cursor-pointer"
                >
                  <CalendarPlus className="h-5 w-5" aria-hidden />
                  Book Your Appointment
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </>
  );
}
