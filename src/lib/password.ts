import bcrypt from "bcryptjs";

/**
 * Hashes a plaintext password with bcrypt (cost factor 10).
 * Node.js only — never import this from middleware or Edge Runtime code.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/** Compares a plaintext password against a bcrypt hash. */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
