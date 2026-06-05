/** Display helpers derived from a user's email — the app has no separate name field. */

/** First letter of the email, uppercased, for avatar chips. Falls back to "?". */
export function getInitial(email?: string | null): string {
  return email?.charAt(0).toUpperCase() ?? "?";
}

/** A friendly first-name-ish handle from the email local part (e.g. "marie.dupont" → "Marie"). */
export function displayName(email?: string | null): string {
  if (!email) return "";
  const handle = email.split("@")[0].split(/[._-]/)[0];
  return handle.charAt(0).toUpperCase() + handle.slice(1);
}
