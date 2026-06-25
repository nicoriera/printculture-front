import { SignJWT, jwtVerify } from "jose";

/**
 * Returns the encoded JWT signing key. `JWT_SECRET` est **requis** (pas de fallback) —
 * vérifié à l'usage (runtime) plutôt qu'à l'import du module, pour que `next build`
 * réussisse sans secret tout en garantissant l'erreur au runtime si absent.
 */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return new TextEncoder().encode(secret);
}

/** Signs a JWT containing `userId` and `email`, valid for 7 days. */
export async function createToken(payload: {
  userId: number;
  email: string;
}): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
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
    const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: ["HS256"] });
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
