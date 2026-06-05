import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromCookie } from "@/lib/auth";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";
import { MessageCreateSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/ratelimit";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookie(request.headers.get("cookie"));
    if (!token) return unauthorizedResponse();
    const payload = await verifyToken(token);
    if (!payload) return unauthorizedResponse();

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "asc" },
      include: { recommendation: true },
    });

    return successResponse({ messages });
  } catch (error) {
    console.error("Get messages error:", error);
    return errorResponse("Failed to fetch messages", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromCookie(request.headers.get("cookie"));
    if (!token) return unauthorizedResponse();
    const payload = await verifyToken(token);
    if (!payload) return unauthorizedResponse();

    // Anti-spam: cap messages per user (in-memory, single-instance).
    const { allowed } = rateLimit(`messages:${payload.userId}`, 30, 60 * 1000);
    if (!allowed) return errorResponse("Trop de messages. Patientez un instant.", 429);

    const parsed = MessageCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const data = parsed.data;
    const message = await prisma.message.create({
      data: {
        content: data.content.trim(),
        recommendationId: data.recommendationId,
        userId: payload.userId,
      },
      include: { recommendation: true },
    });

    return successResponse({ message }, "Message created successfully");
  } catch (error) {
    console.error("Create message error:", error);
    return errorResponse("Failed to create message", 500);
  }
}
