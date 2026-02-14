import DOMPurify from "isomorphic-dompurify";

export interface ValidationError {
  field: string;
  message: string;
}

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (10+ digits)
export function validatePhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10;
}

// Validate date is in future
export function validateFutureDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

// Validate form data
export function validateFormData(data: {
  fullName?: string;
  email?: string;
  phone?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  // Full name validation
  if (!data.fullName || !data.fullName.trim()) {
    errors.push({ field: "fullName", message: "Full name is required" });
  } else if (data.fullName.trim().length < 2) {
    errors.push({ field: "fullName", message: "Name must be at least 2 characters" });
  } else if (data.fullName.trim().length > 100) {
    errors.push({ field: "fullName", message: "Name must be less than 100 characters" });
  }

  // Email validation
  if (!data.email || !data.email.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!validateEmail(data.email.trim())) {
    errors.push({ field: "email", message: "Invalid email format" });
  } else if (data.email.length > 254) {
    errors.push({ field: "email", message: "Email is too long" });
  }

  // Phone validation
  if (!data.phone || !data.phone.trim()) {
    errors.push({ field: "phone", message: "Phone number is required" });
  } else if (!validatePhone(data.phone)) {
    errors.push({ field: "phone", message: "Phone must be at least 10 digits" });
  }

  // Date validation
  if (!data.preferredDate) {
    errors.push({ field: "preferredDate", message: "Preferred date is required" });
  } else if (!validateFutureDate(data.preferredDate)) {
    errors.push({ field: "preferredDate", message: "Please select a future date" });
  }

  // Time validation
  if (!data.preferredTime || !data.preferredTime.trim()) {
    errors.push({ field: "preferredTime", message: "Preferred time is required" });
  }

  // Message validation (optional but validate if provided)
  if (data.message && data.message.length > 1000) {
    errors.push({ field: "message", message: "Message must be less than 1000 characters" });
  }

  return errors;
}

// Escape HTML special characters
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c] ?? c);
}
