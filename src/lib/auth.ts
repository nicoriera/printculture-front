import { SignJWT, jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

/** Signs a JWT containing `userId` and `email`, valid for 7 days. */
export async function createToken(payload: {
  userId: number;
  email: string;
}): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT and returns its payload.
 * Returns `null` instead of throwing when the token is invalid or expired —
 * callers should treat `null` as unauthenticated.
 */
export async function verifyToken(
  token: string
): Promise<{ userId: number; email: string } | null> {
  try {
    // Pin the algorithm so a forged `alg` header can't be substituted.
    const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ["HS256"] });
    // Validate the claim shape rather than blindly casting.
    if (typeof payload.userId === "number" && typeof payload.email === "string") {
      return { userId: payload.userId, email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}

/** Extracts the `auth-token` value from a raw `Cookie` header string. */
export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies["auth-token"] || null;
}
