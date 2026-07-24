import Image from "next/image";

type ProfileAvatarProps = {
  name: string;
  image?: string;
  overlayLabel?: string;
  size?: "small" | "large";
};

export default function ProfileAvatar({
  name,
  image,
  overlayLabel,
  size = "large",
}: ProfileAvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const dimensions = size === "large" ? "h-32 w-32" : "h-10 w-10";

  return (
    <div
      className={`group relative shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#2b6874] shadow-[0_16px_40px_rgba(5,35,43,0.22)] ${dimensions}`}
    >
      {image ? (
        <Image
          src={image}
          alt={`${name} profile`}
          fill
          sizes={size === "large" ? "128px" : "40px"}
          className="object-cover"
          unoptimized
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white">
          {initials || "EP"}
        </span>
      )}
      {overlayLabel ? (
        <span className="absolute inset-0 flex items-center justify-center bg-[#0c3241]/72 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {overlayLabel}
        </span>
      ) : null}
    </div>
  );
}
