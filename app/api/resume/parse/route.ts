import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { buildDocumentResume } from "@/core/resumeParsing/buildDocumentResume";
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

  if (
    file.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
    !file.name.toLowerCase().endsWith(".docx")
  ) {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload a .docx resume." },
      { status: 400 }
    );
  }

  const rawTextResult = await mammoth.extractRawText({ buffer });
  const htmlResult = await mammoth.convertToHtml({ buffer });

  const rawText = rawTextResult.value;
  const htmlPreview = htmlResult.value;

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsedDocument: ParsedResumeDocument = {
    fileName: file.name,
    rawText,
    htmlPreview,
    lines,
    documentResume: buildDocumentResume(lines),
    structuredResume: buildStructuredResume(lines),
    parsedDate: new Date().toISOString(),
  };

  return NextResponse.json(parsedDocument);
}