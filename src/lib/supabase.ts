const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Uploads a file to a Supabase Storage bucket using the service role key.
 * Server-side only — requires `SUPABASE_SERVICE_ROLE_KEY`.
 * @param bucket - Bucket name (e.g. `"recommendations-files"`)
 * @param path - Storage path within the bucket (e.g. `"uuid/filename.pdf"`)
 */
export async function uploadFile(bucket: string, file: File, path: string) {
  const arrayBuffer = await file.arrayBuffer();
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${bucket}/${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": file.type,
        "x-upsert": "false",
        "Cache-Control": "3600",
      },
      body: arrayBuffer,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Upload failed: ${error.message}`);
  }
}

/** Returns the public URL for a file in a Supabase Storage bucket. */
export function getPublicUrl(bucket: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/** Deletes a file from a Supabase Storage bucket. */
export async function deleteFile(bucket: string, path: string) {
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes: [path] }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Delete failed: ${error.message}`);
  }
}
