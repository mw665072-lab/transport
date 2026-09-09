import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { isAuthenticated } from "@/lib/server/auth";
import { getApplication } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = resolve(process.env.RESUME_UPLOAD_DIR ?? "./data/resumes");

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Resumes are served only to a signed-in operator, never from a public path. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return new Response("Not found", { status: 404 });
  }

  const { id } = await params;
  const application = await getApplication(Number(id));
  if (!application?.resume_path) return new Response("Not found", { status: 404 });

  // Refuse anything that resolved outside the upload directory.
  const path = resolve(application.resume_path);
  if (!path.startsWith(UPLOAD_DIR)) return new Response("Not found", { status: 404 });

  try {
    const file = await readFile(path);
    const type = CONTENT_TYPES[extname(path).toLowerCase()] ?? "application/octet-stream";
    const name = (application.resume_filename ?? "resume").replace(/["\\\r\n]/g, "");
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
