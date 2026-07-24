"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "@/core/auth/AuthProvider";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";
import type { UserProfile } from "@/core/user/userTypes";
import { getProfileIntelligence } from "@/modules/home/lib/profileIntelligence";
import HomeHeaderMenu from "./HomeHeaderMenu";
import ProfilePhotoControl from "./ProfilePhotoControl";

type ProfileDraft = Pick<
  UserProfile,
  | "name"
  | "age"
  | "profileImage"
  | "headline"
  | "yearsExperience"
  | "location"
  | "currentTitle"
  | "currentIndustry"
  | "skills"
  | "highlights"
>;

export default function ProfileEditor() {
  const { user, activeResumeId, updateProfile } = useUser();
  const { reopenOnboarding } = useAuth();
  const { setActiveView } = useOSState();
  const profile = useMemo(
    () => getProfileIntelligence(user, activeResumeId),
    [activeResumeId, user]
  );
  const [draft, setDraft] = useState<ProfileDraft>(() => ({
    name: user.name,
    age: user.age,
    profileImage: user.profileImage,
    headline: profile.effective.headline,
    yearsExperience: profile.effective.yearsExperience,
    location: user.location,
    currentTitle: profile.effective.currentTitle,
    currentIndustry: profile.effective.currentIndustry,
    skills: profile.effective.skills,
    highlights: user.highlights,
  }));
  function update<Key extends keyof ProfileDraft>(key: Key, value: ProfileDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateProfile(draft);
    setActiveView("overview");
  }

  const inputClass = "mt-2 h-11 w-full rounded-xl border border-[#c8d8dc] bg-white px-3 text-sm text-[#173a46] outline-none transition focus:border-[#168391] focus:ring-4 focus:ring-[#e8f2f3]";

  return (
    <div className="h-full min-h-0 w-full overflow-hidden bg-white">
      <form onSubmit={save} className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[#c8d8dc] bg-white shadow-[0_18px_50px_rgba(5,35,43,0.1)]">
        <header className="relative z-10 flex shrink-0 flex-col gap-6 bg-[linear-gradient(135deg,#173a46,#2b6874)] p-6 pr-20 text-white sm:flex-row sm:items-center" data-testid="profile-editor-header">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <ProfilePhotoControl
              name={draft.name}
              image={draft.profileImage}
              onChange={(profileImage) => update("profileImage", profileImage)}
              onDelete={() => {
                update("profileImage", undefined);
                updateProfile({ profileImage: undefined });
              }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-semibold tracking-tight">Your profile</h2>
            <p className="mt-2 text-sm text-[#c6d7da]">One profile powers your homepage and planning context.{profile.hasResume ? " Resume details are used as editable defaults." : " Upload a resume to prefill professional details."}</p>
          </div>
          <div className="absolute right-6 top-6">
            <HomeHeaderMenu
              onGuide={() => setActiveView("guide")}
              onLayout={() => setActiveView("layout")}
              onOnboarding={reopenOnboarding}
              onProfile={() => setActiveView("profile")}
              onHome={() => setActiveView("overview")}
              variant="profile"
              tone="dark"
            />
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto" data-testid="profile-editor-scroll">
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">Name<input required value={draft.name} onChange={(event) => update("name", event.target.value)} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-700">Age<input type="number" min="13" max="110" value={draft.age ?? ""} onChange={(event) => update("age", Number(event.target.value) >= 13 ? Number(event.target.value) : undefined)} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-700">Current title<input value={draft.currentTitle} onChange={(event) => update("currentTitle", event.target.value)} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-700">Current industry<input value={draft.currentIndustry} onChange={(event) => update("currentIndustry", event.target.value)} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-700">Location<input value={draft.location} onChange={(event) => update("location", event.target.value)} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-700">Years of experience<input type="number" min="0" max="80" value={draft.yearsExperience ?? ""} onChange={(event) => update("yearsExperience", Number(event.target.value) > 0 ? Number(event.target.value) : undefined)} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-700 sm:col-span-2">Headline<input value={draft.headline ?? ""} onChange={(event) => update("headline", event.target.value)} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-700 sm:col-span-2">Skills <span className="font-normal text-slate-400">comma separated</span><input value={draft.skills.join(", ")} onChange={(event) => update("skills", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-700 sm:col-span-2">Best-of-me highlights <span className="font-normal text-slate-400">one per line</span><textarea value={draft.highlights.join("\n")} onChange={(event) => update("highlights", event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} className="mt-2 min-h-28 w-full rounded-xl border border-[#c8d8dc] p-3 text-sm outline-none focus:border-[#168391] focus:ring-4 focus:ring-[#e8f2f3]" /></label>
          </div>

          <footer className="flex justify-end gap-3 border-t border-[#c8d8dc] p-6">
            <button type="button" onClick={() => setActiveView("overview")} className="rounded-xl border border-[#c8d8dc] px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-[#e8f2f3]">Cancel</button>
            <button type="submit" className="rounded-xl bg-[#126174] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#174f5a]">Save profile</button>
          </footer>
        </div>
      </form>
    </div>
  );
}
