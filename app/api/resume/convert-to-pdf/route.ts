import { NextResponse } from "next/server";
import { convertDocxToPdf } from "@/core/resumeParsing/convertDocxToPdf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No DOCX file provided" }, { status: 400 });
  }

  const isDocx =
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx");

  if (!isDocx) {
    return NextResponse.json({ error: "Only DOCX files can be converted" }, { status: 400 });
  }

  try {
    const pdf = await convertDocxToPdf(Buffer.from(await file.arrayBuffer()));
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `inline; filename="${file.name.replace(/\.docx$/i, ".pdf")}"`,
        "Content-Type": "application/pdf",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "The DOCX file could not be converted to PDF." },
      { status: 422 },
    );
  }
}
