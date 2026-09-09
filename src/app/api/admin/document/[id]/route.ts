import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { isAuthenticated } from "@/lib/server/auth";
import { getDocument } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = resolve(process.env.DOCUMENT_UPLOAD_DIR ?? "./data/documents");

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".heic": "image/heic",
};

/** Documents are served only to a signed-in operator, never from a public path. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return new Response("Not found", { status: 404 });

  const { id } = await params;
  const record = await getDocument(Number(id));
  if (!record?.path) return new Response("Not found", { status: 404 });

  // Refuse anything that resolved outside the upload directory.
  const path = resolve(record.path);
  if (!path.startsWith(UPLOAD_DIR)) return new Response("Not found", { status: 404 });

  try {
    const file = await readFile(path);
    const type = CONTENT_TYPES[extname(path).toLowerCase()] ?? "application/octet-stream";
    const name = (record.filename || "document").replace(/["\\\r\n]/g, "");
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": type,
        "Content-Disposition": `attachment; filename="${name}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
