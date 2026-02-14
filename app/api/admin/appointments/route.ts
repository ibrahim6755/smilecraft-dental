import { NextRequest, NextResponse } from "next/server";
import { getAppointments, getAppointmentById, updateAppointment, deleteAppointment } from "@/lib/db";
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

    const appointments = getAppointments();
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
    const { id, status, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Get the original appointment to check status change
    const originalAppointment = getAppointmentById(id);
    if (!originalAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const appointment = updateAppointment(id, { ...updates, status: status || undefined });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

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

    const deleted = deleteAppointment(id);

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
