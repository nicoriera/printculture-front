import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { RegisterSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
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
