import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromCookie } from "@/lib/auth";
import { successResponse, unauthorizedResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookie(request.headers.get("cookie"));

    if (!token) {
      return unauthorizedResponse();
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return unauthorizedResponse();
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return unauthorizedResponse();
    }

    return successResponse({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return unauthorizedResponse();
  }
}
