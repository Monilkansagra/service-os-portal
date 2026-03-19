"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Please enter credentials" };
  }

  try {
    // Look up user with role information
    const user = await db.users.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    // Validate credentials using bcrypt
    let passwordMatches = false;
    try {
      passwordMatches = await bcrypt.compare(password, user.password);
    } catch {
      passwordMatches = false;
    }

    if (!passwordMatches) {
      return { success: false, message: "Invalid email or password" };
    }

    // Generate JWT token
    const token = await signToken({
      user_id: user.user_id,
      email: user.email,
      role: user.roles.role_name,
      full_name: user.full_name,
    });

    // Determine redirect destination
    let redirectTo = "/portal-dashboard";
    if (user.roles.role_name === "Admin") {
      redirectTo = "/admin-dashboard";
    } else if (user.roles.role_name === "HOD") {
      redirectTo = "/hod-dashboard";
    }

    // Set cookies directly in the server action (Next 16 async cookies API)
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Non-sensitive convenience cookies
    cookieStore.set("user_id", user.user_id.toString(), { path: "/" });
    cookieStore.set("user_role", user.roles.role_name, { path: "/" });
    cookieStore.set("user_name", user.full_name, { path: "/" });

    return { success: true, redirectTo };
  } catch (error) {
    console.error("LOGIN_ACTION_ERROR:", error);
    return { success: false, message: "Server error. Please try again." };
  }
}