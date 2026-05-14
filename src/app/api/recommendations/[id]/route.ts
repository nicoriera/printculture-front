import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromCookie } from "@/lib/auth";
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-response";
import { RecommendationUpdateSchema } from "@/lib/schemas";

function parseId(raw: string): number | null {
  const id = parseInt(raw, 10);
  return isNaN(id) ? null : id;
}

async function getCurrentUserId(request: NextRequest): Promise<number | null> {
  const token = getTokenFromCookie(request.headers.get("cookie"));
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.userId ?? null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return errorResponse("Invalid recommendation ID");

    const recommendation = await prisma.recommendation.findUnique({ where: { id } });
    if (!recommendation) return notFoundResponse();

    return successResponse({ recommendation });
  } catch (error) {
    console.error("Get recommendation error:", error);
    return errorResponse("Failed to fetch recommendation", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId(request);
    if (!userId) return unauthorizedResponse();

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return errorResponse("Invalid recommendation ID");

    const existing = await prisma.recommendation.findUnique({ where: { id } });
    if (!existing) return notFoundResponse();

    const body = await request.json();
    const parsed = RecommendationUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const data = parsed.data;
    const recommendation = await prisma.recommendation.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.link !== undefined && { link: data.link || null }),
        ...(data.tag !== undefined && { tag: data.tag }),
        ...(data.videoLink !== undefined && { videoLink: data.videoLink || null }),
        ...(data.fileUrl !== undefined && { fileUrl: data.fileUrl }),
        ...(data.fileName !== undefined && { fileName: data.fileName }),
      },
    });

    return successResponse({ recommendation }, "Recommendation updated successfully");
  } catch (error) {
    console.error("Update recommendation error:", error);
    return errorResponse("Failed to update recommendation", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId(request);
    if (!userId) return unauthorizedResponse();

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return errorResponse("Invalid recommendation ID");

    const existing = await prisma.recommendation.findUnique({ where: { id } });
    if (!existing) return notFoundResponse();

    await prisma.recommendation.delete({ where: { id } });

    return successResponse(null, "Recommendation deleted successfully");
  } catch (error) {
    console.error("Delete recommendation error:", error);
    return errorResponse("Failed to delete recommendation", 500);
  }
}
