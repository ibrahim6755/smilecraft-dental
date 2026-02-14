"use client";

import { X } from "lucide-react";
import { AppointmentForm } from "@/components/AppointmentForm";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 overflow-y-auto">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Center the modal content */}
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Modal content */}
        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -right-4 -top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-dental-gray-500 shadow-lg transition-colors hover:bg-dental-gray-100 hover:text-dental-gray-700 focus:outline-none focus:ring-2 focus:ring-dental-primary"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="border-b border-dental-gray-200 px-6 py-5 sm:px-8 sm:py-6">
            <h2 className="text-2xl font-bold text-dental-gray-900">
              Book Your <span className="text-dental-primary">Appointment</span>
            </h2>
            <p className="mt-2 text-sm text-dental-gray-600">
              Fill out the form below and we'll confirm your appointment soon.
            </p>
          </div>

          {/* Form content */}
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <AppointmentForm onSuccess={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}
