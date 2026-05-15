import { NextResponse } from "next/server";

/** Standard envelope returned by every API route. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/** 200 OK with typed `data` payload. */
export function successResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

/** 400 (or custom status) with an error message. */
export function errorResponse(
  message: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

/** 401 Unauthorized — missing or invalid auth token. */
export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
    },
    { status: 401 }
  );
}

/** 404 Not Found. */
export function notFoundResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: "Not found",
    },
    { status: 404 }
  );
}
