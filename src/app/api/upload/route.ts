import { NextRequest } from "next/server";
import { verifyToken, getTokenFromCookie } from "@/lib/auth";
import { uploadFile, getPublicUrl } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-response";

/** Detects MIME type from file magic bytes — immune to spoofed Content-Type headers. */
function detectMimeFromBytes(bytes: Uint8Array): string | null {
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "image/gif";
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf";
  // WEBP: RIFF????WEBP
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  // ZIP-based (DOCX, ODT…)
  if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  // OLE2 compound (DOC, XLS…)
  if (bytes[0] === 0xD0 && bytes[1] === 0xCF && bytes[2] === 0x11 && bytes[3] === 0xE0) {
    return "application/msword";
  }
  return null;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp",
  ".pdf", ".txt", ".doc", ".docx",
]);

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromCookie(request.headers.get("cookie"));
    if (!token) return unauthorizedResponse();

    const payload = await verifyToken(token);
    if (!payload) return unauthorizedResponse();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("No file provided");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse("File too large. Maximum size is 10MB");
    }

    // Read file content once for both magic-byte and upload
    const buffer = await file.arrayBuffer();
    const header = new Uint8Array(buffer).slice(0, 12);

    // Server-side MIME detection via magic bytes — client-supplied file.type is ignored
    const detectedMime = detectMimeFromBytes(header);
    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;

    // For text/plain there are no magic bytes — fall back to extension check
    const effectiveMime = detectedMime ?? (ext === ".txt" ? "text/plain" : null);

    if (!effectiveMime || !ALLOWED_MIME_TYPES.has(effectiveMime) || !ALLOWED_EXTENSIONS.has(ext)) {
      return errorResponse("Type de fichier non autorisé", 415);
    }

    // Generate unique filename — strip dangerous characters, prevent double extensions
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.(?!([^.]+$))/g, "_");
    const fileName = `${Date.now()}-${safeName}`;
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
