"use client";

import { useEffect, useState } from "react";
import type { ParsedResumeDocument } from "@/core/resumeParsing/parsedResumeTypes";

type DocumentViewerProps = {
  document: ParsedResumeDocument;
};

function isPdf(document: ParsedResumeDocument) {
  const fileType = document.originalFileType?.toLowerCase() ?? "";
  const fileName = document.originalFileName?.toLowerCase() ?? "";
  return fileType === "application/pdf" || fileName.endsWith(".pdf");
}

function isDocx(document: ParsedResumeDocument) {
  const fileType = document.originalFileType?.toLowerCase() ?? "";
  const fileName = document.originalFileName?.toLowerCase() ?? "";
  return (
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  );
}

async function dataUrlToFile(dataUrl: string, fileName: string, fileType: string) {
  const response = await fetch(dataUrl);
  if (!response.ok) throw new Error("Could not load the uploaded document.");
  return new File([await response.blob()], fileName, { type: fileType });
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  const documentIsPdf = isPdf(document);
  const documentIsDocx = isDocx(document);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const pdfSource =
    document.previewFileDataUrl ??
    convertedPdfUrl ??
    (documentIsPdf ? document.originalFileDataUrl : undefined);

  useEffect(() => {
    if (
      !documentIsDocx ||
      document.previewFileDataUrl ||
      !document.originalFileDataUrl
    ) {
      return;
    }

    let cancelled = false;
    let objectUrl: string | undefined;

    const convert = async () => {
      setIsConverting(true);
      setConversionError(null);

      try {
        const fileType =
          document.originalFileType ||
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        const file = await dataUrlToFile(
          document.originalFileDataUrl as string,
          document.originalFileName || "resume.docx",
          fileType,
        );
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/resume/convert-to-pdf", {
          body: formData,
          method: "POST",
        });

        if (!response.ok) throw new Error("The DOCX preview could not be converted to PDF.");
        objectUrl = URL.createObjectURL(await response.blob());
        if (!cancelled) setConvertedPdfUrl(objectUrl);
      } catch (error) {
        if (!cancelled) {
          setConversionError(
            error instanceof Error ? error.message : "PDF conversion failed.",
          );
        }
      } finally {
        if (!cancelled) setIsConverting(false);
      }
    };

    void convert();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [document, documentIsDocx]);

  if (pdfSource) {
    return (
      <div className="h-full min-h-[48rem] w-full overflow-hidden rounded-2xl bg-white">
        <iframe
          className="h-full min-h-[48rem] w-full border-0"
          src={pdfSource}
          title={document.previewFileName ?? document.originalFileName ?? document.fileName}
        />
      </div>
    );
  }

  if (documentIsDocx && isConverting) {
    return (
      <div className="flex min-h-[48rem] items-center justify-center bg-white text-sm text-slate-500">
        Converting DOCX to PDF preview…
      </div>
    );
  }

  return (
    <div className="flex min-h-[32rem] items-center justify-center bg-white p-8 text-center text-sm text-slate-500">
      {conversionError ?? "The uploaded document is not available for PDF preview."}
    </div>
  );
}
