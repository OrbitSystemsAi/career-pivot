import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import type { ParseParameters } from "pdf-parse";
import { buildDocumentResume } from "@/core/resumeParsing/buildDocumentResume";
import { buildStructuredResume } from "@/core/resumeParsing/buildStructuredResume";
import { convertDocxToPdf } from "@/core/resumeParsing/convertDocxToPdf";
import type { ParsedResumeDocument } from "@/core/resumeParsing/parsedResumeTypes";

export const runtime = "nodejs";

type ParsedFile = {
  rawText: string;
  htmlPreview: string;
  pdfPreview?: Buffer;
};

function isDocx(file: File) {
  return (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  );
}

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function getResumeParseErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("password") || message.includes("encrypted")) {
    return "This PDF appears to be password protected. Please upload an unlocked PDF or a .docx resume.";
  }

  return "Resume parsing failed. Please upload a text-based PDF or a .docx resume.";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function parseDocx(buffer: Buffer): Promise<ParsedFile> {
  const [rawTextResult, htmlResult, pdfPreview] = await Promise.all([
    mammoth.extractRawText({ buffer }),
    mammoth.convertToHtml({ buffer }),
    convertDocxToPdf(buffer).catch(() => undefined),
  ]);

  return {
    rawText: rawTextResult.value,
    htmlPreview: htmlResult.value,
    pdfPreview,
  };
}

function buildPdfPreview(rawText: string) {
  return rawText
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`
    )
    .join("");
}

async function extractPdfText(buffer: Buffer, options: ParseParameters) {
  const parser = new PDFParse({
    data: new Uint8Array(buffer),
    disableFontFace: true,
    isEvalSupported: false,
    stopAtErrors: false,
    useSystemFonts: true,
  });

  try {
    const result = await parser.getText(options);
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}

async function parsePdf(buffer: Buffer): Promise<ParsedFile> {
  const parseAttempts: ParseParameters[] = [
    { pageJoiner: "\n\n" },
    {
      cellSeparator: " ",
      disableNormalization: true,
      includeMarkedContent: true,
      itemJoiner: " ",
      lineEnforce: false,
      pageJoiner: "\n\n",
    },
  ];
  let lastError: unknown;

  for (const options of parseAttempts) {
    try {
      const rawText = await extractPdfText(buffer, options);

      if (rawText) {
        return {
          rawText,
          htmlPreview: buildPdfPreview(rawText),
        };
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return {
    rawText: "",
    htmlPreview: "",
  };
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!isDocx(file) && !isPdf(file)) {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload a .docx or .pdf resume." },
      { status: 400 }
    );
  }

  let parsedFile: ParsedFile;

  try {
    parsedFile = isPdf(file) ? await parsePdf(buffer) : await parseDocx(buffer);
  } catch (error) {
    return NextResponse.json(
      { error: getResumeParseErrorMessage(error) },
      { status: 422 }
    );
  }

  const { rawText, htmlPreview, pdfPreview } = parsedFile;

  if (!rawText.trim()) {
    return NextResponse.json(
      {
        error:
          "No readable resume text was found. Please upload a text-based PDF or a .docx resume.",
      },
      { status: 422 }
    );
  }

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
    previewFileName: pdfPreview ? file.name.replace(/\.docx$/i, ".pdf") : undefined,
    previewFileType: pdfPreview ? "application/pdf" : undefined,
    previewFileDataUrl: pdfPreview
      ? `data:application/pdf;base64,${pdfPreview.toString("base64")}`
      : undefined,
    parsedDate: new Date().toISOString(),
  };

  return NextResponse.json(parsedDocument);
}
