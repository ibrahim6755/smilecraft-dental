import { NextResponse } from "next/server";
import { createAppointment, isTimeSlotBooked } from "@/lib/db";
import { validateFormData, sanitizeInput } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendNewAppointmentNotificationEmail } from "@/lib/email";

type AppointmentBody = {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
};

function validateBody(body: unknown): { ok: true; data: AppointmentBody } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body is required." };
  }

  const b = body as Record<string, unknown>;
  const fullName = typeof b.fullName === "string" ? b.fullName.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const preferredDate = typeof b.preferredDate === "string" ? b.preferredDate.trim() : "";
  const preferredTime = typeof b.preferredTime === "string" ? b.preferredTime.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (!fullName || fullName.length < 2) {
    return { ok: false, error: "Full name is required (at least 2 characters)." };
  }
  if (!email) {
    return { ok: false, error: "Email is required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Invalid email address." };
  }
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return { ok: false, error: "Valid phone number is required (at least 10 digits)." };
  }
  if (!preferredDate) {
    return { ok: false, error: "Preferred date is required." };
  }
  if (!preferredTime) {
    return { ok: false, error: "Preferred time is required." };
  }

  return {
    ok: true,
    data: { fullName, email, phone, preferredDate, preferredTime, message: message || undefined },
  };
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate body structure
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    let sanitizedData;
    try {
      sanitizedData = {
        fullName: typeof body.fullName === "string" ? sanitizeInput(body.fullName.trim()) : "",
        email: typeof body.email === "string" ? sanitizeInput(body.email.trim()) : "",
        phone: typeof body.phone === "string" ? sanitizeInput(body.phone.trim()) : "",
        preferredDate: typeof body.preferredDate === "string" ? body.preferredDate.trim() : "",
        preferredTime: typeof body.preferredTime === "string" ? body.preferredTime.trim() : "",
        message: typeof body.message === "string" ? sanitizeInput(body.message.trim()) : "",
      };
    } catch (err) {
      console.error("Sanitization error:", err);
      return NextResponse.json(
        {
          success: false,
          error: "Error processing your input. Please try again.",
        },
        { status: 400 }
      );
    }

    // Validate sanitized data
    let validationErrors: any[] = [];
    try {
      validationErrors = validateFormData(sanitizedData);
    } catch (err) {
      console.error("Validation error:", err);
      return NextResponse.json(
        {
          success: false,
          error: "Form validation error. Please check your input.",
        },
        { status: 400 }
      );
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: validationErrors[0].message,
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Check if time slot is already booked
    try {
      if (isTimeSlotBooked(sanitizedData.preferredDate, sanitizedData.preferredTime)) {
        return NextResponse.json(
          {
            success: false,
            error: "This time slot is already booked. Please select a different date or time.",
          },
          { status: 409 }
        );
      }
    } catch (err) {
      console.error("Error checking time slot availability:", err);
      // Continue anyway if there's an error checking availability
    }

    // Save appointment to database
    let appointment;
    try {
      appointment = createAppointment(
        sanitizedData.fullName,
        sanitizedData.email,
        sanitizedData.phone,
        sanitizedData.preferredDate,
        sanitizedData.preferredTime,
        sanitizedData.message || undefined
      );
    } catch (err) {
      console.error("Error creating appointment:", err);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save appointment. Please try again.",
        },
        { status: 500 }
      );
    }

    console.log("✅ New appointment created:", {
      id: appointment.id,
      email: appointment.email,
      date: appointment.preferredDate,
    });

    // Send admin notification of new appointment (non-blocking)
    sendNewAppointmentNotificationEmail(appointment).then((sent) => {
      if (sent) {
        console.log(`✅ Admin notification sent for new appointment ${appointment.id}`);
      } else {
        console.warn(`⚠️ Failed to send admin notification for appointment ${appointment.id}`);
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment request sent successfully. Awaiting admin confirmation.",
        appointmentId: appointment.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Appointment API error:", err);
    console.error("Error stack:", err instanceof Error ? err.stack : "No stack trace");
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
