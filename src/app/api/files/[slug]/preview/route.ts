import { NextResponse } from "next/server";
import { createFileReadStream, fileExists } from "@/lib/storage";
import { isImageMimeType } from "@/lib/transfer-og";
import { getTransferBySlug } from "@/lib/transfers";
import { Readable } from "stream";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const transfer = await getTransferBySlug(slug);

  if (!transfer || !isImageMimeType(transfer.mimeType)) {
    return NextResponse.json({ error: "Vista previa no disponible." }, { status: 404 });
  }

  const exists = await fileExists(transfer.storedName);
  if (!exists) {
    return NextResponse.json(
      { error: "El archivo ya no está disponible en el servidor." },
      { status: 410 },
    );
  }

  const stream = createFileReadStream(transfer.storedName);
  const webStream = Readable.toWeb(stream) as ReadableStream;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": transfer.mimeType,
      "Content-Disposition": `inline; filename="${encodeURIComponent(transfer.originalName)}"`,
      "Content-Length": String(transfer.sizeBytes),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
