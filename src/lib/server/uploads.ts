import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { extname, join, resolve } from "node:path";

/**
 * Shared upload handling for resumes and shipping documents.
 *
 * Files are written under a generated name with a whitelisted extension, so a
 * crafted filename can neither escape the directory nor land as an executable.
 * The original name is kept for display only and never used as a path.
 */
export type StoredFile = { ok: true; filename: string; path: string };
export type UploadError = { ok: false; message: string };

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function storeUpload(
  file: File,
  opts: {
    directory: string;
    allowedTypes: readonly string[];
    allowedExtensions: readonly string[];
    maxBytes: number;
    rejectMessage: string;
  },
): Promise<StoredFile | UploadError> {
  const extension = extname(file.name).toLowerCase();
  const typeAllowed = opts.allowedTypes.includes(file.type);
  const extensionAllowed = opts.allowedExtensions.includes(extension);
  if (!typeAllowed && !extensionAllowed) return { ok: false, message: opts.rejectMessage };
  if (file.size === 0) return { ok: false, message: "That file appears to be empty." };
  if (file.size > opts.maxBytes) {
    return { ok: false, message: `Keep the file under ${formatBytes(opts.maxBytes)}.` };
  }

  const directory = resolve(opts.directory);
  const safeExtension = extensionAllowed ? extension : opts.allowedExtensions[0];
  const storedName = `${Date.now()}-${randomUUID()}${safeExtension}`;
  const destination = join(directory, storedName);

  await mkdir(directory, { recursive: true });
  await writeFile(destination, Buffer.from(await file.arrayBuffer()));

  return { ok: true, filename: file.name.slice(0, 160), path: destination };
}
