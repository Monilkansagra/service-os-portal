import { db } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find user with role
        const user = await db.users.findUnique({
            where: { email },
            include: { roles: true },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Validate credentials (support both hashed and plain-text passwords for dev data)
        let passwordMatches = false;
        try {
            passwordMatches = await bcrypt.compare(password, user.password);
        } catch {
            passwordMatches = false;
        }

        if (!passwordMatches && user.password === password) {
            passwordMatches = true;
        }

        if (!passwordMatches) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
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

        // Build response and set HTTP-only JWT cookie
        const response = NextResponse.json({
            success: true,
            redirectTo,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.roles.role_name,
            },
        });

        // Set JWT as HTTP-only secure cookie (valid 24h)
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        // Also keep plain cookies for UI display (non-sensitive)
        response.cookies.set("user_id", user.user_id.toString(), { path: "/" });
        response.cookies.set("user_role", user.roles.role_name, { path: "/" });
        response.cookies.set("user_name", user.full_name, { path: "/" });

        return response;
    } catch (error) {
        console.error("LOGIN_API_ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Server error. Please try again." },
            { status: 500 }
        );
    }
}
