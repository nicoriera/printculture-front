import { NextRequest } from "next/server";
import { verifyToken, getTokenFromCookie } from "@/lib/auth";
import { uploadFile, getPublicUrl } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = getTokenFromCookie(request.headers.get("cookie"));
    if (!token) {
      return unauthorizedResponse();
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("No file provided");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return errorResponse("File too large. Maximum size is 10MB");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return errorResponse("File type not allowed");
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const filePath = `recommendations/${fileName}`;

    // Upload to Supabase Storage
    await uploadFile("recommendations-files", file, filePath);

    // Get public URL
    const publicUrl = getPublicUrl("recommendations-files", filePath);

    return successResponse(
      {
        fileName: file.name,
        fileUrl: publicUrl,
        filePath,
      },
      "File uploaded successfully"
    );
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse("Failed to upload file", 500);
  }
}
