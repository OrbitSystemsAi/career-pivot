"use client";

import { ChangeEvent, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";

type ProfilePhotoControlProps = {
  name: string;
  image?: string;
  onChange: (image: string) => void;
  onDelete: () => void;
};

export default function ProfilePhotoControl({
  name,
  image,
  onChange,
  onDelete,
}: ProfilePhotoControlProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  function readPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
        setConfirmDelete(false);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <div className="group relative shrink-0 rounded-[21px] p-[5px] focus-within:ring-4 focus-within:ring-[#f28c28]/60">
      <ProfileAvatar name={name} image={image} />
      <div
        className={`absolute inset-[5px] flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#0c3241]/72 px-3 text-white transition-opacity ${confirmDelete ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"}`}
      >
        {confirmDelete ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <button
              type="button"
              className="text-xs font-semibold text-[#ffb25c] underline decoration-2 underline-offset-4 hover:text-white"
              onClick={() => {
                onDelete();
                setConfirmDelete(false);
              }}
            >
              Confirm Delete
            </button>
            <button
              type="button"
              className="text-[11px] text-white/80 hover:text-white"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <label className="cursor-pointer text-sm font-semibold hover:text-[#ffb25c]">
              {image ? "Edit" : "Upload"}
              <input
                type="file"
                accept="image/*"
                aria-label={image ? "Edit profile photo" : "Upload profile photo"}
                className="sr-only"
                onChange={readPhoto}
              />
            </label>
            {image ? (
              <button
                type="button"
                className="text-sm font-semibold hover:text-[#ffb25c]"
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
