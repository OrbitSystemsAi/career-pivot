"use client";

import { useRef } from "react";
import ActionRow from "@/core/ui/ActionRow";
import { useUser } from "@/core/user/UserProvider";

export default function ResumeUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addResume } = useUser();

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    addResume({
      name: file.name.replace(/\.[^/.]+$/, ""),
      fileName: file.name,
      fileType: file.type || "unknown",
      fileSize: file.size,
    });

    event.target.value = "";
  }

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />

      <ActionRow
        label="Upload resume"
        action="Add"
        onClick={handleUploadClick}
      />
    </div>
  );
}