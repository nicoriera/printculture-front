import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromCookie } from "@/lib/auth";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";
import { RecommendationCreateSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookie(request.headers.get("cookie"));
    if (!token) return unauthorizedResponse();
    const payload = await verifyToken(token);
    if (!payload) return unauthorizedResponse();

    const recommendations = await prisma.recommendation.findMany({
      orderBy: { createdAt: "desc" },
    });

    return successResponse({ recommendations });
  } catch (error) {
    console.error("Get recommendations error:", error);
    return errorResponse("Failed to fetch recommendations", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromCookie(request.headers.get("cookie"));
    if (!token) return unauthorizedResponse();
    const payload = await verifyToken(token);
    if (!payload) return unauthorizedResponse();

    const body = await request.json();
    const parsed = RecommendationCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const data = parsed.data;
    const recommendation = await prisma.recommendation.create({
      data: {
        title: data.title.trim(),
        description: data.description,
        category: data.category,
        link: data.link || null,
        tag: data.tag,
        videoLink: data.videoLink || null,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
      },
    });

    return successResponse({ recommendation }, "Recommendation created successfully");
  } catch (error) {
    console.error("Create recommendation error:", error);
    return errorResponse("Failed to create recommendation", 500);
  }
}
