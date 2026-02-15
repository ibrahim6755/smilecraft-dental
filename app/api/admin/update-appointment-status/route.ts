import { NextRequest, NextResponse } from "next/server";
import { getAppointmentById, updateAppointment } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { sendConfirmationEmail, sendCancellationEmail, sendAdminNotificationEmail } from "@/lib/email";

type RequestBody = {
  appointmentId: string;
  newStatus: string;
};

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      console.warn("❌ Unauthorized attempt to update appointment status");
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate request body structure
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request body must be an object" },
        { status: 400 }
      );
    }

    const { appointmentId, newStatus } = body as RequestBody;

    // Validate appointmentId
    if (!appointmentId || typeof appointmentId !== "string" || !appointmentId.trim()) {
      return NextResponse.json(
        { success: false, error: "appointmentId is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate newStatus
    const validStatuses = ["confirmed", "cancelled"];
    if (!newStatus || typeof newStatus !== "string" || !validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: `newStatus must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Get the original appointment
    const originalAppointment = await getAppointmentById(appointmentId);
    if (!originalAppointment) {
      console.warn(`⚠️ Appointment not found: ${appointmentId}`);
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check if status is already the same
    if (originalAppointment.status === newStatus) {
      return NextResponse.json(
        {
          success: false,
          error: `Appointment is already ${newStatus}`,
        },
        { status: 400 }
      );
    }

    // Update appointment status in database
    const updatedAppointment = await updateAppointment(appointmentId, {
      status: newStatus as "confirmed" | "cancelled",
    });

    if (!updatedAppointment) {
      console.error(`❌ Failed to update appointment: ${appointmentId}`);
      return NextResponse.json(
        { success: false, error: "Failed to update appointment" },
        { status: 500 }
      );
    }

    console.log(`📝 Appointment ${appointmentId} status updated to: ${newStatus}`);

    // Send emails based on status change
    let emailSent = false;

    if (newStatus === "confirmed") {
      console.log(`📧 Sending confirmation email to ${updatedAppointment.email}...`);
      emailSent = await sendConfirmationEmail(updatedAppointment);
      if (emailSent) {
        console.log(`✅ Confirmation email sent to ${updatedAppointment.email}`);
      } else {
        console.warn(`⚠️ Failed to send confirmation email to ${updatedAppointment.email}`);
      }
    } else if (newStatus === "cancelled") {
      console.log(`📧 Sending cancellation email to ${updatedAppointment.email}...`);
      emailSent = await sendCancellationEmail(updatedAppointment);
      if (emailSent) {
        console.log(`✅ Cancellation email sent to ${updatedAppointment.email}`);
      } else {
        console.warn(`⚠️ Failed to send cancellation email to ${updatedAppointment.email}`);
      }
    }

    // Send admin notification
    console.log(`📧 Sending admin notification for appointment ${appointmentId}...`);
    const adminNotificationSent = await sendAdminNotificationEmail(
      updatedAppointment,
      newStatus as "confirmed" | "cancelled"
    );
    if (adminNotificationSent) {
      console.log(`✅ Admin notification sent`);
    } else {
      console.warn(`⚠️ Failed to send admin notification`);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Appointment status updated to ${newStatus}`,
        appointment: updatedAppointment,
        emailSent,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating appointment status:", err);
    console.error("Error details:", err instanceof Error ? err.message : String(err));

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while updating the appointment",
      },
      { status: 500 }
    );
  }
}
