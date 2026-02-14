"use client";

import { useState } from "react";
import { CalendarPlus, User, Mail, Phone, Calendar, Clock, MessageSquare, Loader2, CheckCircle } from "lucide-react";

type FormErrors = Partial<Record<keyof FormState | 'form', string>>;

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
};

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
};

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {};
  const nameTrimmed = values.fullName.trim();
  const emailTrimmed = values.email.trim();
  const phoneTrimmed = values.phone.trim();

  if (!nameTrimmed) {
    errors.fullName = "Full name is required.";
  } else if (nameTrimmed.length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!emailTrimmed) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    errors.email = "Please enter a valid email address.";
  }

  const digitsOnly = phoneTrimmed.replace(/\D/g, "");
  if (!phoneTrimmed) {
    errors.phone = "Phone number is required.";
  } else if (digitsOnly.length < 10) {
    errors.phone = "Please enter a valid phone number (at least 10 digits).";
  }

  if (!values.preferredDate.trim()) {
    errors.preferredDate = "Preferred date is required.";
  }

  if (!values.preferredTime.trim()) {
    errors.preferredTime = "Preferred time is required.";
  }

  return errors;
}

interface AppointmentFormProps {
  onSuccess?: () => void;
}

export function AppointmentForm({ onSuccess }: AppointmentFormProps = {}) {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm(formState);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string; message?: string };

      if (!res.ok) {
        setErrors({
          form: typeof data.error === "string" ? data.error : "Something went wrong. Please try again.",
        });
        return;
      }

      if (data.success) {
        setIsSuccess(true);
        setFormState(initialFormState);
        // Call the onSuccess callback if provided
        if (onSuccess) {
          setTimeout(onSuccess, 1500);
        }
      } else {
        setErrors({
          form: typeof data.error === "string" ? data.error : "Something went wrong. Please try again.",
        });
      }
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-dental-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-dental-primary/10 text-dental-primary">
            <CheckCircle className="h-8 w-8" aria-hidden />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-dental-gray-900">
            Request received
          </h3>
          <p className="mt-2 max-w-sm text-dental-gray-600">
            Thank you for booking with us. We will confirm your appointment by
            phone or email shortly.
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="mt-6 text-sm font-medium text-dental-primary hover:underline"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  const timeOptions = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-dental-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dental-primary/10 text-dental-primary">
          <CalendarPlus className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-dental-gray-900">
            Book an Appointment
          </h2>
          <p className="text-sm text-dental-gray-600">
            We’ll get back to you to confirm your visit.
          </p>
        </div>
      </div>

      {errors.form && (
        <div
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.form}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="flex items-center gap-2 text-sm font-medium text-dental-gray-800"
          >
            <User className="h-4 w-4 text-dental-gray-500" aria-hidden />
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formState.fullName}
            onChange={handleChange}
            autoComplete="name"
            placeholder="John Smith"
            className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-dental-gray-900 shadow-sm transition-colors placeholder:text-dental-gray-400 focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-0 ${
              errors.fullName
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                : "border-dental-gray-300 focus:border-dental-primary"
            }`}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <p id="fullName-error" className="mt-1 text-sm text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-medium text-dental-gray-800"
          >
            <Mail className="h-4 w-4 text-dental-gray-500" aria-hidden />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="john@example.com"
            className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-dental-gray-900 shadow-sm transition-colors placeholder:text-dental-gray-400 focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-0 ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                : "border-dental-gray-300 focus:border-dental-primary"
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="flex items-center gap-2 text-sm font-medium text-dental-gray-800"
          >
            <Phone className="h-4 w-4 text-dental-gray-500" aria-hidden />
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            autoComplete="tel"
            placeholder="(555) 123-4567"
            className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-dental-gray-900 shadow-sm transition-colors placeholder:text-dental-gray-400 focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-0 ${
              errors.phone
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                : "border-dental-gray-300 focus:border-dental-primary"
            }`}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="preferredDate"
              className="flex items-center gap-2 text-sm font-medium text-dental-gray-800"
            >
              <Calendar className="h-4 w-4 text-dental-gray-500" aria-hidden />
              Preferred Date
            </label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formState.preferredDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-dental-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-0 ${
                errors.preferredDate
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  : "border-dental-gray-300 focus:border-dental-primary"
              }`}
              aria-invalid={!!errors.preferredDate}
              aria-describedby={errors.preferredDate ? "preferredDate-error" : undefined}
            />
            {errors.preferredDate && (
              <p id="preferredDate-error" className="mt-1 text-sm text-red-600">
                {errors.preferredDate}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="preferredTime"
              className="flex items-center gap-2 text-sm font-medium text-dental-gray-800"
            >
              <Clock className="h-4 w-4 text-dental-gray-500" aria-hidden />
              Preferred Time
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formState.preferredTime}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-dental-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-0 ${
                errors.preferredTime
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  : "border-dental-gray-300 focus:border-dental-primary"
              }`}
              aria-invalid={!!errors.preferredTime}
              aria-describedby={errors.preferredTime ? "preferredTime-error" : undefined}
            >
              <option value="">Select time</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.preferredTime && (
              <p id="preferredTime-error" className="mt-1 text-sm text-red-600">
                {errors.preferredTime}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="flex items-center gap-2 text-sm font-medium text-dental-gray-800"
          >
            <MessageSquare className="h-4 w-4 text-dental-gray-500" aria-hidden />
            Message <span className="text-dental-gray-400">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formState.message}
            onChange={handleChange}
            rows={3}
            placeholder="Any notes or reason for visit..."
            className="mt-1 block w-full rounded-lg border border-dental-gray-300 px-4 py-2.5 text-dental-gray-900 shadow-sm transition-colors placeholder:text-dental-gray-400 focus:border-dental-primary focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-0"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-dental-primary px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-dental-primary-dark focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Submitting...
          </>
        ) : (
          <>
            <CalendarPlus className="h-5 w-5" aria-hidden />
            Request Appointment
          </>
        )}
      </button>
    </form>
  );
}
