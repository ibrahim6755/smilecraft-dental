import { NextResponse } from "next/server";
import { logoutAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    await logoutAdminSession();
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
