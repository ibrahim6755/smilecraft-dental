import { NextRequest, NextResponse } from "next/server";
import { getAppointments, getAppointmentById, updateAppointment, deleteAppointment, type Appointment } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { sendConfirmationEmail, sendCancellationEmail, sendAdminNotificationEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const appointments = await getAppointments();
    return NextResponse.json({ appointments }, { status: 200 });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin session
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, fullName, email, phone, preferredDate, preferredTime, message } = body;

    console.log("📝 Update request received:", { id, status, fullName, email, phone, preferredDate, preferredTime, message });

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Get the original appointment to check status change
    const originalAppointment = await getAppointmentById(id);
    if (!originalAppointment) {
      console.error(`❌ Appointment with ID '${id}' not found in database`);
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Build update object with only the fields that should be updated
    const updateData: Partial<Appointment> = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (preferredDate !== undefined) updateData.preferredDate = preferredDate;
    if (preferredTime !== undefined) updateData.preferredTime = preferredTime;
    if (message !== undefined) updateData.message = message;
    if (status !== undefined) updateData.status = status;

    console.log("🔄 Updating appointment with data:", updateData);

    const appointment = await updateAppointment(id, updateData);

    if (!appointment) {
      console.error(`❌ Failed to update appointment with ID '${id}'`);
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Appointment ${id} updated successfully:`, appointment);

    // Send email if status changed to confirmed
    if (status === "confirmed" && originalAppointment.status !== "confirmed") {
      console.log(`🔔 Status changed to CONFIRMED for appointment ${id}. Sending emails...`);
      await sendConfirmationEmail(appointment);
      await sendAdminNotificationEmail(appointment, "confirmed");
    }

    // Send email if status changed to cancelled
    if (status === "cancelled" && originalAppointment.status !== "cancelled") {
      console.log(`🔔 Status changed to CANCELLED for appointment ${id}. Sending emails...`);
      await sendCancellationEmail(appointment);
      await sendAdminNotificationEmail(appointment, "cancelled");
    }

    return NextResponse.json({ appointment }, { status: 200 });
  } catch (err) {
    console.error("Error updating appointment:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin session
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteAppointment(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Appointment deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting appointment:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
