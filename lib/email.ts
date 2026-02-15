import nodemailer from "nodemailer";
import type { Appointment } from "./db";

async function createTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn("⚠️ Email credentials not configured. Confirmation emails will not be sent.");
    console.warn("Add EMAIL_USER and EMAIL_PASS to .env.local to enable email sending.");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

function buildConfirmationEmailHtml(appointment: Appointment): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f1f5f9;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
    <div style="background:#0ea5e9;color:#ffffff;padding:20px 24px;">
      <h1 style="margin:0;font-size:20px;font-weight:600;">✓ Appointment Confirmed</h1>
      <p style="margin:8px 0 0;font-size:14px;opacity:0.95;">SmileCraft Dental</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 16px;color:#0f172a;font-size:16px;">Dear ${escapeHtml(appointment.fullName)},</p>
      
      <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
        We are pleased to inform you that your appointment at SmileCraft Dental has been confirmed.
      </p>

      <div style="background:#f1f5f9;border-left:4px solid #0ea5e9;padding:16px;margin:24px 0;border-radius:4px;">
        <p style="margin:0 0 12px;color:#0f172a;font-size:14px;font-weight:600;">Appointment Details:</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;width:100px;">Date:</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:500;">${escapeHtml(appointment.preferredDate)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">Time:</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:500;">${escapeHtml(appointment.preferredTime)}</td>
          </tr>
        </table>
      </div>

      <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
        We look forward to seeing you and helping you achieve a healthier smile.
      </p>

      <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
        If you need to reschedule, please contact us.
      </p>

      <div style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px;">
        <p style="margin:0 0 8px;color:#475569;font-size:14px;">Best regards,</p>
        <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600;">SmileCraft Dental Team</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c] ?? c);
}

export async function sendConfirmationEmail(appointment: Appointment): Promise<boolean> {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      console.log("❌ Email not sent: No email credentials configured");
      return false;
    }

    console.log(`📧 Sending confirmation email to ${appointment.email}...`);

    const result = await transporter.sendMail({
      from: `"SmileCraft Dental" <${process.env.EMAIL_USER}>`,
      to: appointment.email,
      subject: "Your Appointment is Confirmed - SmileCraft Dental",
      html: buildConfirmationEmailHtml(appointment),
      text: `
Appointment Confirmed - SmileCraft Dental

Dear ${appointment.fullName},

We are pleased to inform you that your appointment at SmileCraft Dental has been confirmed.

Appointment Details:
Date: ${appointment.preferredDate}
Time: ${appointment.preferredTime}

We look forward to seeing you and helping you achieve a healthier smile.

If you need to reschedule, please contact us.

Best regards,
SmileCraft Dental Team
      `.trim(),
    });

    console.log(`✅ Confirmation email sent successfully to ${appointment.email}`);
    console.log(`📬 Message ID: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending confirmation email:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.message.includes("Invalid login")) {
      console.error("💡 Tip: Check your EMAIL_USER and EMAIL_PASS in .env.local");
    }
    return false;
  }
}

export async function sendNewAppointmentNotificationEmail(appointment: Appointment): Promise<boolean> {
  try {
    const transporter = await createTransporter();
    const adminEmail = process.env.EMAIL_USER;

    if (!transporter || !adminEmail) {
      console.log("❌ Admin notification not sent: No email credentials configured");
      return false;
    }

    console.log(`📧 Sending new appointment notification to admin (${adminEmail})...`);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f1f5f9;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
    <div style="background:#f59e0b;color:#ffffff;padding:20px 24px;">
      <h1 style="margin:0;font-size:20px;font-weight:600;">🔔 New Appointment Pending Review</h1>
      <p style="margin:8px 0 0;font-size:14px;opacity:0.95;">SmileCraft Dental Admin</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 16px;color:#0f172a;font-size:16px;">New Appointment Received</p>
      <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">A new appointment has been submitted and is awaiting your review. Please confirm or reject this appointment.</p>
      
      <div style="background:#f1f5f9;border-left:4px solid #f59e0b;padding:16px;margin:24px 0;border-radius:4px;">
        <p style="margin:0 0 12px;color:#0f172a;font-size:14px;font-weight:600;">Appointment Details:</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;width:120px;font-weight:600;">Client Name</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;">${escapeHtml(appointment.fullName)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:600;">Email</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;"><a href="mailto:${escapeHtml(appointment.email)}" style="color:#f59e0b;">${escapeHtml(appointment.email)}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:600;">Phone</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;">${escapeHtml(appointment.phone)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:600;">Date</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;">${escapeHtml(appointment.preferredDate)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:600;">Time</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;">${escapeHtml(appointment.preferredTime)}</td>
          </tr>
          ${appointment.message ? `<tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:600;">Message</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;">${escapeHtml(appointment.message)}</td>
          </tr>` : ''}
        </table>
      </div>

      <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;">
        <strong>Next Steps:</strong><br>
        1. Review the appointment details<br>
        2. Confirm or cancel the appointment<br>
        3. The client will receive an email notification automatically
      </p>

      <div style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px;">
        <p style="margin:0;color:#64748b;font-size:12px;">Appointment ID: ${escapeHtml(appointment.id)}</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

    const result = await transporter.sendMail({
      from: `"SmileCraft Dental" <${adminEmail}>`,
      to: adminEmail,
      subject: `[NEW] Appointment from ${escapeHtml(appointment.fullName)} - ${escapeHtml(appointment.preferredDate)}`,
      html,
      text: `
New Appointment Pending Review

Client: ${appointment.fullName}
Email: ${appointment.email}
Phone: ${appointment.phone}
Date: ${appointment.preferredDate}
Time: ${appointment.preferredTime}

${appointment.message ? `Message: ${appointment.message}` : ''}

Appointment ID: ${appointment.id}

Next Steps:
1. Review the appointment details
2. Confirm or cancel the appointment
3. The client will receive an email notification automatically
      `.trim(),
    });

    console.log(`✅ New appointment notification sent to admin`);
    console.log(`📬 Message ID: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending new appointment notification:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.message.includes("Invalid login")) {
      console.error("💡 Tip: Check your EMAIL_USER and EMAIL_PASS in .env.local");
    }
    return false;
  }
}

export async function sendAdminNotificationEmail(
  appointment: Appointment,
  action: "confirmed" | "cancelled"
): Promise<boolean> {
  try {
    const transporter = await createTransporter();
    const adminEmail = process.env.EMAIL_USER;

    if (!transporter || !adminEmail) {
      console.log("Admin notification email not sent: No email credentials configured");
      return false;
    }

    const actionText = action === "confirmed" ? "✓ Confirmed" : "✗ Cancelled";
    const actionColor = action === "confirmed" ? "#0ea5e9" : "#ef4444";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f1f5f9;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
    <div style="background:${actionColor};color:#ffffff;padding:20px 24px;">
      <h1 style="margin:0;font-size:20px;font-weight:600;">Appointment ${actionText}</h1>
      <p style="margin:8px 0 0;font-size:14px;opacity:0.95;">SmileCraft Dental Admin</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 16px;color:#0f172a;font-size:16px;">Admin Notification</p>
      <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">An appointment has been ${action}. Details below:</p>
      
      <table style="width:100%;border-collapse:collapse;background:#f1f5f9;border-radius:4px;padding:16px;">
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:14px;width:120px;font-weight:600;">Client Name</td>
          <td style="padding:8px 0;color:#0f172a;font-size:14px;">${escapeHtml(appointment.fullName)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:600;">Email</td>
          <td style="padding:8px 0;color:#0f172a;font-size:14px;"><a href="mailto:${escapeHtml(appointment.email)}" style="color:${actionColor};">${escapeHtml(appointment.email)}</a></td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:600;">Phone</td>
          <td style="padding:8px 0;color:#0f172a;font-size:14px;">${escapeHtml(appointment.phone)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:600;">Date</td>
          <td style="padding:8px 0;color:#0f172a;font-size:14px;">${escapeHtml(appointment.preferredDate)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:600;">Time</td>
          <td style="padding:8px 0;color:#0f172a;font-size:14px;">${escapeHtml(appointment.preferredTime)}</td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>
    `.trim();

    await transporter.sendMail({
      from: `"SmileCraft Dental" <${adminEmail}>`,
      to: adminEmail,
      subject: `[Admin] Appointment ${actionText} - ${escapeHtml(appointment.fullName)}`,
      html,
      text: `
Appointment ${actionText}

Client: ${appointment.fullName}
Email: ${appointment.email}
Phone: ${appointment.phone}
Date: ${appointment.preferredDate}
Time: ${appointment.preferredTime}

Status: ${action.toUpperCase()}
      `.trim(),
    });

    console.log(`✅ Admin notification sent for appointment ${appointment.id}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending admin notification email:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.message.includes("Invalid login")) {
      console.error("💡 Tip: Check your EMAIL_USER and EMAIL_PASS in .env.local");
    }
    return false;
  }
}

export async function sendCancellationEmail(appointment: Appointment): Promise<boolean> {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      console.log("❌ Email not sent: No email credentials configured");
      return false;
    }

    console.log(`📧 Sending cancellation email to ${appointment.email}...`);

    const result = await transporter.sendMail({
      from: `"SmileCraft Dental" <${process.env.EMAIL_USER}>`,
      to: appointment.email,
      subject: "Appointment Cancelled - SmileCraft Dental",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f1f5f9;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
    <div style="background:#ef4444;color:#ffffff;padding:20px 24px;">
      <h1 style="margin:0;font-size:20px;font-weight:600;">Appointment Cancelled</h1>
      <p style="margin:8px 0 0;font-size:14px;opacity:0.95;">SmileCraft Dental</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 16px;color:#0f172a;font-size:16px;">Dear ${escapeHtml(appointment.fullName)},</p>
      
      <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
        We regret to inform you that your appointment has been cancelled.
      </p>

      <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
        If this was not requested or you would like to reschedule, please contact us at your earliest convenience.
      </p>

      <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
        We apologize for any inconvenience.
      </p>

      <div style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px;">
        <p style="margin:0 0 8px;color:#475569;font-size:14px;">Kind regards,</p>
        <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600;">SmileCraft Dental Team</p>
      </div>
    </div>
  </div>
</body>
</html>
      `.trim(),
      text: `
Appointment Cancelled - SmileCraft Dental

Dear ${appointment.fullName},

We regret to inform you that your appointment has been cancelled.

If this was not requested or you would like to reschedule, please contact us at your earliest convenience.

We apologize for any inconvenience.

Kind regards,
SmileCraft Dental Team
      `.trim(),
    });

    console.log(`✅ Cancellation email sent successfully to ${appointment.email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending cancellation email:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.message.includes("Invalid login")) {
      console.error("💡 Tip: Check your EMAIL_USER and EMAIL_PASS in .env.local");
    }
    return false;
  }
}
