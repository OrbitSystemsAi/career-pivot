"use client";

import { useRef, useState } from "react";
import ActionRow from "@/core/ui/ActionRow";
import type { ParsedResumeDocument } from "@/core/resumeParsing/parsedResumeTypes";
import { useUser } from "@/core/user/UserProvider";

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
  const fallbackMessage =
    "We couldn’t read that résumé. Please try a text-based PDF or DOCX file.";
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    return body?.error ?? fallbackMessage;
  }

  return fallbackMessage;
}

export default function ResumeUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addResume } = useUser();
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  function handleUploadClick() {
    if (isParsing) {
      return;
    }

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

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const [parsedDocument, originalFileDataUrl] = await Promise.all([
        parseResumeFile(file),
        readFileAsDataUrl(file),
      ]);

      addResume({
        name: file.name.replace(/\.[^/.]+$/, ""),
        fileName: file.name,
        fileType: file.type || "unknown",
        fileSize: file.size,
        parsedDocument: {
          ...parsedDocument,
          originalFileName: file.name,
          originalFileType: file.type || "unknown",
          originalFileDataUrl,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Resume parsing failed";

      setParseError(message);
    } finally {
      setIsParsing(false);
      event.target.value = "";
    }
  }

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <ActionRow
        label={isParsing ? "Parsing resume..." : "Upload resume"}
        action={isParsing ? "Working" : "Add"}
        onClick={handleUploadClick}
      />

      {parseError && (
        <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs leading-5 text-red-600">
          {parseError}
        </div>
      )}
    </div>
  );
}
