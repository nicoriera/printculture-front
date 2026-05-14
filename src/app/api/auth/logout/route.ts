import { successResponse } from "@/lib/api-response";

export async function POST() {
  const response = successResponse(null, "Logout successful");

  // Clear the auth cookie
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // Expire immediately
  });

  return response;
}
