import { NextResponse } from "next/server";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { buildStructuredResume } from "@/core/resumeParsing/buildStructuredResume";
import type { ParsedResumeDocument } from "@/core/resumeParsing/parsedResumeTypes";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let rawText = "";

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    rawText = result.value;
  } else if (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  ) {
    const result = await pdfParse(buffer);
    rawText = result.text;
  } else {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 }
    );
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsedDocument: ParsedResumeDocument = {
    fileName: file.name,
    rawText,
    lines,
    structuredResume: buildStructuredResume(lines),
    parsedDate: new Date().toISOString(),
  };

  return NextResponse.json(parsedDocument);
}