import fs from "fs";
import path from "path";

export interface Appointment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  createdAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

const DATA_DIR = path.join(process.cwd(), "data");
const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Get all appointments
export function getAppointments(): Appointment[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(APPOINTMENTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(APPOINTMENTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading appointments:", error);
    return [];
  }
}

// Create new appointment
export function createAppointment(
  fullName: string,
  email: string,
  phone: string,
  preferredDate: string,
  preferredTime: string,
  message?: string
): Appointment {
  const appointment: Appointment = {
    id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fullName,
    email,
    phone,
    preferredDate,
    preferredTime,
    message,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  const appointments = getAppointments();
  appointments.push(appointment);

  ensureDataDir();
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));

  return appointment;
}

// Get appointment by ID
export function getAppointmentById(id: string): Appointment | null {
  const appointments = getAppointments();
  return appointments.find((apt) => apt.id === id) || null;
}

// Update appointment
export function updateAppointment(
  id: string,
  updates: Partial<Appointment>
): Appointment | null {
  const appointments = getAppointments();
  const index = appointments.findIndex((apt) => apt.id === id);

  if (index === -1) {
    return null;
  }

  const updated = { ...appointments[index], ...updates, id, createdAt: appointments[index].createdAt };
  appointments[index] = updated;

  ensureDataDir();
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));

  return updated;
}

// Delete appointment
export function deleteAppointment(id: string): boolean {
  const appointments = getAppointments();
  const filtered = appointments.filter((apt) => apt.id !== id);

  if (filtered.length === appointments.length) {
    return false; // Not found
  }

  ensureDataDir();
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(filtered, null, 2));

  return true;
}

// Check if a time slot is already booked
export function isTimeSlotBooked(preferredDate: string, preferredTime: string): boolean {
  const appointments = getAppointments();
  return appointments.some(
    (apt) =>
      apt.preferredDate === preferredDate &&
      apt.preferredTime === preferredTime &&
      apt.status !== "cancelled"
  );
}
