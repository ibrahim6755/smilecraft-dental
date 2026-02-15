"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Edit2, Trash2, CheckCircle, Clock, X, Save, Mail, Loader2 } from "lucide-react";
import type { Appointment } from "@/lib/db";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Appointment>>({});
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ id: string; message: string } | null>(null);
  const router = useRouter();

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/appointments");

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!res.ok) {
        setError("Failed to fetch appointments");
        return;
      }

      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/appointments?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("Failed to delete appointment");
        return;
      }

      setAppointments(appointments.filter((apt) => apt.id !== id));
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Something went wrong");
    }
  }

  async function handleSave(id: string) {
    try {
      setSavingId(id);
      setEmailStatus(null);
      
      // Only send the fields that can be updated (skip null values)
      const updatePayload: any = {
        id,
      };
      
      if (editData.status !== undefined) updatePayload.status = editData.status;
      if (editData.fullName !== undefined) updatePayload.fullName = editData.fullName;
      if (editData.email !== undefined) updatePayload.email = editData.email;
      if (editData.phone !== undefined) updatePayload.phone = editData.phone;
      if (editData.preferredDate !== undefined) updatePayload.preferredDate = editData.preferredDate;
      if (editData.preferredTime !== undefined) updatePayload.preferredTime = editData.preferredTime;
      if (editData.message !== undefined && editData.message !== null) updatePayload.message = editData.message;
      
      // Show status message if status is changing
      if (updatePayload.status === "confirmed") {
        setEmailStatus({ id, message: "📧 Sending confirmation email..." });
      } else if (updatePayload.status === "cancelled") {
        setEmailStatus({ id, message: "📧 Sending cancellation email..." });
      }
      
      console.log("📤 Sending update payload:", updatePayload);
      
      const res = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();
      console.log("📥 Response from server:", { status: res.status, data });

      if (!res.ok) {
        setError(data.error || "Failed to update appointment");
        setEmailStatus(null);
        return;
      }

      setAppointments(appointments.map((apt) => (apt.id === id ? data.appointment : apt)));
      
      // Show success message
      if (updatePayload.status === "confirmed") {
        setEmailStatus({ id, message: "✅ Confirmation email sent!" });
        setTimeout(() => setEmailStatus(null), 3000);
      } else if (updatePayload.status === "cancelled") {
        setEmailStatus({ id, message: "✅ Cancellation email sent!" });
        setTimeout(() => setEmailStatus(null), 3000);
      }
      
      setEditingId(null);
      setEditData({});
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError("Something went wrong");
      setEmailStatus(null);
    } finally {
      setSavingId(null);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dental-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-dental-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dental-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dental-gray-50">
      {/* Header */}
      <header className="border-b border-dental-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dental-gray-900">
                Appointment Management
              </h1>
              <p className="mt-1 text-sm text-dental-gray-600">
                View and manage all appointment requests
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-auto block text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="rounded-lg border border-dental-gray-200 bg-white p-12 text-center">
            <p className="text-dental-gray-600">No appointments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-dental-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-dental-gray-200 bg-dental-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-dental-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-dental-gray-900">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-dental-gray-900">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-dental-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-dental-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <Fragment key={apt.id}>
                    <tr className="border-b border-dental-gray-200 hover:bg-dental-gray-50">
                      <td className="px-6 py-4">
                        {editingId === apt.id ? (
                          <input
                            type="text"
                            value={editData.fullName || apt.fullName}
                            onChange={(e) =>
                              setEditData({ ...editData, fullName: e.target.value })
                            }
                            className="rounded border border-dental-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          <div>
                            <span className="font-medium text-dental-gray-900">
                              {apt.fullName}
                            </span>
                            {apt.message && (
                              <p className="mt-1 text-xs text-dental-gray-500">
                                "{apt.message}"
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-dental-gray-600">
                        {editingId === apt.id ? (
                          <div className="space-y-1">
                            <input
                              type="date"
                              value={editData.preferredDate || apt.preferredDate}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  preferredDate: e.target.value,
                                })
                              }
                              className="block rounded border border-dental-gray-300 px-2 py-1 text-sm"
                            />
                            <input
                              type="text"
                              value={editData.preferredTime || apt.preferredTime}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  preferredTime: e.target.value,
                                })
                              }
                              className="block rounded border border-dental-gray-300 px-2 py-1 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            {apt.preferredDate} at {apt.preferredTime}
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 text-dental-gray-600">
                        {editingId === apt.id ? (
                          <div className="space-y-1">
                            <input
                              type="email"
                              value={editData.email || apt.email}
                              onChange={(e) =>
                                setEditData({ ...editData, email: e.target.value })
                              }
                              className="block w-full rounded border border-dental-gray-300 px-2 py-1 text-sm"
                            />
                            <input
                              type="tel"
                              value={editData.phone || apt.phone}
                              onChange={(e) =>
                                setEditData({ ...editData, phone: e.target.value })
                              }
                              className="block w-full rounded border border-dental-gray-300 px-2 py-1 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <div>{apt.email}</div>
                            <div className="text-xs text-dental-gray-500">{apt.phone}</div>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === apt.id ? (
                          <select
                            value={editData.status || apt.status}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                status: e.target.value as any,
                              })
                            }
                            className="rounded border border-dental-gray-300 px-2 py-1 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              apt.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : apt.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {apt.status === "confirmed" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {apt.status.charAt(0).toUpperCase() +
                              apt.status.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingId === apt.id ? (
                            <>
                              <button
                                onClick={() => handleSave(apt.id)}
                                disabled={savingId === apt.id}
                                className="rounded-lg bg-green-100 p-2 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={savingId === apt.id ? "Saving..." : "Save"}
                              >
                                {savingId === apt.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditData({});
                                }}
                                disabled={savingId === apt.id}
                                className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(apt.id);
                                  setEditData(apt);
                                }}
                                className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(apt.id)}
                                className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {emailStatus?.id === apt.id && (
                      <tr className="bg-blue-50 border-b border-blue-200">
                        <td colSpan={5} className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {emailStatus.message.includes("Sending") ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">{emailStatus.message}</span>
                              </>
                            ) : (
                              <>
                                <Mail className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">{emailStatus.message}</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
