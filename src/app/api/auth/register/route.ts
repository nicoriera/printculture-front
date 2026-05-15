import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { successResponse, errorResponse } from "@/lib/api-response";
import { RegisterSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const { allowed } = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
    if (!allowed) return errorResponse("Trop de tentatives. Réessayez dans 1 heure.", 429);

    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }
    const { email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse("User already exists", 409);
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, password: hashedPassword } });

    const token = await createToken({ userId: user.id, email: user.email });

    const response = successResponse(
      { user: { id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt } },
      "User created successfully"
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse("Internal server error", 500);
  }
}
