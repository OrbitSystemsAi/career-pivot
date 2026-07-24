"use client";

import { useEffect, useRef, useState } from "react";

type HomeHeaderMenuProps = {
  onGuide: () => void;
  onLayout: () => void;
  onOnboarding: () => void;
  onProfile: () => void;
  onHome?: () => void;
  variant?: "home" | "profile";
  tone?: "dark" | "light";
};

export default function HomeHeaderMenu({
  onGuide,
  onLayout,
  onOnboarding,
  onProfile,
  onHome,
  variant = "home",
  tone = "light",
}: HomeHeaderMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const menuItems = variant === "profile"
    ? [
        { label: "Home", onSelect: onHome ?? (() => undefined) },
        { label: "Guide", onSelect: onGuide },
      ]
    : [
        { label: "Profile", onSelect: onProfile },
        { label: "Onboarding", onSelect: onOnboarding },
        { label: "Layout", onSelect: onLayout },
        { label: "Guide", onSelect: onGuide },
      ];
  const triggerTone =
    tone === "dark"
      ? "text-[#c6d7da] hover:bg-white/10 hover:text-[#ff9b42]"
      : "text-[#248ba3] hover:bg-[#edf7f9] hover:text-[#ff7a00]";

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOpen ? "Close home menu" : "Open home menu"}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a00] ${triggerTone}`}
        data-testid="home-header-menu-button"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>

      {isOpen ? (
        <div
          aria-label="Home menu"
          className="absolute right-0 top-11 z-50 min-w-40 overflow-hidden rounded-xl bg-white py-2 shadow-[0_18px_45px_rgba(15,48,64,0.18)] ring-1 ring-[#d7e6ea]"
          data-testid="home-header-menu"
          role="menu"
        >
          {menuItems.map((item) => (
            <button
              className="block w-full px-4 py-2.5 text-left text-sm font-medium text-[#294653] transition hover:bg-[#edf7f9] hover:text-[#ff7a00] focus:bg-[#edf7f9] focus:text-[#ff7a00] focus:outline-none"
              key={item.label}
              onClick={() => {
                setIsOpen(false);
                item.onSelect();
              }}
              role="menuitem"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
