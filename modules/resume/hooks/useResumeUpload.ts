"use client";

import { useRef, useState, type ChangeEvent } from "react";
import type { ParsedResumeDocument } from "@/core/resumeParsing/parsedResumeTypes";
import { useUser } from "@/core/user/UserProvider";

export const resumeFileAccept =
  ".docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read uploaded file."));
      }
    };

    reader.onerror = () => reject(new Error("Could not read uploaded file."));
    reader.readAsDataURL(file);
  });
}

async function getResumeParseError(response: Response) {
  const fallbackMessage = response.status >= 500
    ? "The résumé service had a temporary problem. Please try the upload again."
    : "We couldn’t read that résumé. Please try a text-based PDF or DOCX file.";
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    return body?.error ?? fallbackMessage;
  }

  return fallbackMessage;
}

type UseResumeUploadOptions = {
  onParsed?: (parsedDocument: ParsedResumeDocument, file: File) => void;
};

export function useResumeUpload(options: UseResumeUploadOptions = {}) {
  const { addResume } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  function openResumePicker() {
    if (isParsing) return;
    setParseError(null);
    fileInputRef.current?.click();
  }

  async function parseResumeFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/resume/parse", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await getResumeParseError(response));
    }

    return (await response.json()) as ParsedResumeDocument;
  }

  async function handleResumeFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError(null);

    try {
      const [parsedDocument, originalFileDataUrl] = await Promise.all([
        parseResumeFile(file),
        readFileAsDataUrl(file),
      ]);

      const enrichedDocument: ParsedResumeDocument = {
        ...parsedDocument,
        originalFileName: file.name,
        originalFileType: file.type || "unknown",
        originalFileDataUrl,
      };

      addResume({
        name: file.name.replace(/\.[^/.]+$/, ""),
        fileName: file.name,
        fileType: file.type || "unknown",
        fileSize: file.size,
        parsedDocument: enrichedDocument,
      });
      options.onParsed?.(enrichedDocument, file);
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Resume parsing failed"
      );
    } finally {
      setIsParsing(false);
      event.target.value = "";
    }
  }

  return {
    fileInputRef,
    isParsing,
    parseError,
    openResumePicker,
    handleResumeFileChange,
  };
}
