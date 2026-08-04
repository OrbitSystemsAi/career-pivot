"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/core/auth/AuthProvider";
import type { CareerPivotPost, PostApiError, PostAudience, PostChannel, PostCitation, PostDraftInput } from "../lib/postingTypes";

type UserPostingEditorProps = { onClose: () => void };

const fieldLabelClass = "flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.08em] text-[#536a78]";
const fieldClass = "mt-2 w-full border border-[#ccd9de] bg-white px-4 py-3 text-sm text-[#173a46] outline-none transition-colors placeholder:text-[#8a969c] focus:border-[#168391] disabled:bg-[#eef2f3]";

function parseCitations(value: string): PostCitation[] {
  return value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [label, url] = line.includes("|") ? line.split("|", 2).map((part) => part.trim()) : [line, line];
    return { label, url };
  });
}

function citationsText(citations: PostCitation[]) {
  return citations.map((citation) => citation.label === citation.url ? citation.url : `${citation.label} | ${citation.url}`).join("\n");
}

async function readApi<T>(response: Response) {
  return response.json().catch(() => ({})) as Promise<T>;
}

export default function UserPostingEditor({ onClose }: UserPostingEditorProps) {
  const { session } = useAuth();
  const [posts, setPosts] = useState<CareerPivotPost[]>([]);
  const [draftId, setDraftId] = useState<string>();
  const [project, setProject] = useState("");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [story, setStory] = useState("");
  const [tags, setTags] = useState("");
  const [citations, setCitations] = useState("");
  const [audience, setAudience] = useState<PostAudience>("public");
  const [channels, setChannels] = useState<PostChannel[]>(["onn", "career-pivot"]);
  const [status, setStatus] = useState<CareerPivotPost["status"]>("draft");
  const [lastError, setLastError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("New story · Not yet saved");
  const [isBusy, setIsBusy] = useState(false);

  const loadPosts = useCallback(async () => {
    const response = await fetch("/api/posts", { cache: "no-store" });
    if (!response.ok) return;
    const result = await readApi<{ posts: CareerPivotPost[] }>(response);
    setPosts(result.posts ?? []);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/posts", { cache: "no-store" })
      .then((response) => response.ok ? readApi<{ posts: CareerPivotPost[] }>(response) : { posts: [] })
      .then((result) => {
        if (active) setPosts(result.posts ?? []);
      });
    return () => { active = false; };
  }, []);

  function currentInput(): PostDraftInput {
    return {
      project,
      title: headline,
      summary,
      body: story,
      topics: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      citations: parseCitations(citations),
      distribution: { audience, channels },
    };
  }

  function loadDraft(post: CareerPivotPost) {
    setDraftId(post.id);
    setProject(post.project);
    setHeadline(post.title);
    setSummary(post.summary);
    setStory(post.body);
    setTags(post.topics.join(", "));
    setCitations(citationsText(post.citations));
    setAudience(post.distribution.audience);
    setChannels(post.distribution.channels);
    setStatus(post.status);
    setLastError(post.lastError);
    setFieldErrors({});
    setNotice(post.status === "submitted" ? `Submitted to ONN · ${post.onnSubmissionId}` : `Saved locally · ${new Date(post.updatedAt).toLocaleString()}`);
  }

  function newDraft() {
    setDraftId(undefined);
    setProject("");
    setHeadline("");
    setSummary("");
    setStory("");
    setTags("");
    setCitations("");
    setAudience("public");
    setChannels(["onn", "career-pivot"]);
    setStatus("draft");
    setLastError(undefined);
    setFieldErrors({});
    setNotice("New story · Not yet saved");
  }

  async function saveDraft() {
    setIsBusy(true);
    setFieldErrors({});
    setNotice("Saving locally…");
    try {
      const response = await fetch(draftId ? `/api/posts/${draftId}` : "/api/posts", {
        method: draftId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentInput()),
      });
      const result = await readApi<{ post?: CareerPivotPost } & PostApiError>(response);
      if (!response.ok || !result.post) throw new Error(result.error ?? "The draft could not be saved.");
      setDraftId(result.post.id);
      setStatus(result.post.status);
      setLastError(undefined);
      setNotice(`Saved locally · ${new Date(result.post.updatedAt).toLocaleString()}`);
      await loadPosts();
      return result.post;
    } catch (error) {
      setNotice((error as Error).message);
      return null;
    } finally {
      setIsBusy(false);
    }
  }

  async function submitToOnn() {
    const saved = await saveDraft();
    if (!saved) return;
    setIsBusy(true);
    setNotice("Submitting to ONN…");
    try {
      const response = await fetch(`/api/posts/${saved.id}/submit`, { method: "POST" });
      const result = await readApi<{ post?: CareerPivotPost; retryable?: boolean } & PostApiError>(response);
      if (!response.ok || !result.post) {
        if (result.post) {
          setStatus(result.post.status);
          setLastError(result.post.lastError);
        }
        setFieldErrors(result.fields ?? {});
        throw new Error(result.error ?? "ONN submission failed.");
      }
      setStatus(result.post.status);
      setLastError(undefined);
      setNotice(`Submitted to ONN · ${result.post.onnSubmissionId}`);
      await loadPosts();
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      setIsBusy(false);
    }
  }

  function toggleChannel(channel: PostChannel) {
    setChannels((current) => current.includes(channel) ? current.filter((candidate) => candidate !== channel) : [...current, channel]);
  }

  const readOnly = status === "submitted";
  const statusTone = status === "submitted" ? "text-emerald-700" : status === "failed" ? "text-red-700" : status === "submitting" ? "text-amber-700" : "text-[#168391]";

  return (
    <section className="min-h-full bg-white" data-testid="user-posting-editor">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d6e0e4] px-5 py-3 sm:px-7">
        <div><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#168391]">OSai News Network</p><h2 className="mt-1 text-lg font-semibold text-[#173a46]">Create Post</h2></div>
        <div className="flex items-center gap-4">
          <select aria-label="Open a saved story" className="max-w-52 border border-[#ccd9de] bg-white px-3 py-2 text-xs text-[#173a46]" onChange={(event) => {
            const selected = posts.find((post) => post.id === event.target.value);
            if (selected) loadDraft(selected);
          }} value={draftId ?? ""}>
            <option value="">Open saved story…</option>
            {posts.map((post) => <option key={post.id} value={post.id}>{post.title || "Untitled draft"} · {post.status}</option>)}
          </select>
          <button className="text-xs font-semibold text-[#168391]" onClick={newDraft} type="button">New</button>
          <button className="text-xs font-semibold text-[#5e7278]" onClick={onClose} type="button">Close</button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-9rem)] xl:grid-cols-[minmax(0,1.4fr)_minmax(24rem,1fr)]">
        <form className="space-y-5 px-5 py-6 sm:px-7" onSubmit={(event) => event.preventDefault()}>
          <div><label className="text-sm font-medium text-[#ff3b24]" htmlFor="post-project">Project</label><select className={`${fieldClass} h-12`} disabled={readOnly} id="post-project" onChange={(event) => setProject(event.target.value)} value={project}><option value="">Select Project</option><option>Career Pivot</option><option>OSai News Network</option><option>Personal Leadership</option></select>{fieldErrors.project ? <p className="mt-1 text-xs text-red-700">{fieldErrors.project}</p> : null}</div>

          <div><label className={fieldLabelClass} htmlFor="post-headline"><span>Headline</span><span className="font-normal text-[#87969d]">{headline.length}/100</span></label><input autoFocus className={fieldClass} disabled={readOnly} id="post-headline" maxLength={100} onChange={(event) => setHeadline(event.target.value)} placeholder="Write a clear, specific headline" value={headline} />{fieldErrors.title ? <p className="mt-1 text-xs text-red-700">{fieldErrors.title}</p> : null}</div>

          <div><label className={fieldLabelClass} htmlFor="post-summary"><span>Summary</span><span className="font-normal text-[#87969d]">{summary.length}/220</span></label><textarea className={`${fieldClass} min-h-24 resize-y`} disabled={readOnly} id="post-summary" maxLength={220} onChange={(event) => setSummary(event.target.value)} placeholder="Summarize the story in one or two sentences" value={summary} />{fieldErrors.summary ? <p className="mt-1 text-xs text-red-700">{fieldErrors.summary}</p> : null}</div>

          <div><label className={fieldLabelClass} htmlFor="post-story"><span>Story</span><span className="font-normal text-[#87969d]">{story.length}/5000</span></label><textarea className={`${fieldClass} min-h-72 resize-y`} disabled={readOnly} id="post-story" maxLength={5000} onChange={(event) => setStory(event.target.value)} placeholder="Write the story here..." value={story} />{fieldErrors.body ? <p className="mt-1 text-xs text-red-700">{fieldErrors.body}</p> : null}</div>

          <div><label className={fieldLabelClass} htmlFor="post-tags"><span>Topics</span></label><input className={fieldClass} disabled={readOnly} id="post-tags" onChange={(event) => setTags(event.target.value)} placeholder="Separate topics with commas" value={tags} />{fieldErrors.topics ? <p className="mt-1 text-xs text-red-700">{fieldErrors.topics}</p> : null}</div>

          <div><label className={fieldLabelClass} htmlFor="post-citations"><span>Citations</span></label><textarea className={`${fieldClass} min-h-24 resize-y`} disabled={readOnly} id="post-citations" onChange={(event) => setCitations(event.target.value)} placeholder={'One per line: Source label | https://example.com'} value={citations} /><p className="mt-1 text-[10px] text-[#708087]">Citations are validated on the server before ONN submission.</p></div>

          <fieldset className="border border-[#ccd9de] p-4" disabled={readOnly}><legend className="px-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#536a78]">Distribution</legend><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-[#173a46]">Audience<select className={`${fieldClass} mt-2`} onChange={(event) => setAudience(event.target.value as PostAudience)} value={audience}><option value="public">Public</option><option value="network">My network</option><option value="groups">My groups</option></select></label><div><p className="text-xs font-semibold text-[#173a46]">Channels</p><label className="mt-3 flex items-center gap-2 text-xs"><input checked={channels.includes("onn")} onChange={() => toggleChannel("onn")} type="checkbox" /> ONN</label><label className="mt-2 flex items-center gap-2 text-xs"><input checked={channels.includes("career-pivot")} onChange={() => toggleChannel("career-pivot")} type="checkbox" /> Career Pivot</label></div></div>{fieldErrors.distribution ? <p className="mt-2 text-xs text-red-700">{fieldErrors.distribution}</p> : null}</fieldset>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#d6e0e4] pt-5"><div><p className={`text-xs font-bold uppercase tracking-[0.08em] ${statusTone}`}>{status}</p><p aria-live="polite" className="mt-1 text-[10px] text-[#708087]">{notice}</p>{lastError ? <p className="mt-1 max-w-md text-xs text-red-700">{lastError}</p> : null}</div><div className="flex gap-3">{!readOnly ? <button className="border border-[#173a46] px-5 py-3 text-xs font-semibold text-[#173a46] disabled:opacity-50" disabled={isBusy} onClick={() => void saveDraft()} type="button">Save Draft Locally</button> : null}{!readOnly ? <button className="bg-[#173a46] px-6 py-3 text-xs font-semibold text-white hover:bg-[#168391] disabled:cursor-not-allowed disabled:bg-[#b9c5c8]" disabled={isBusy} onClick={() => void submitToOnn()} type="button">{status === "failed" ? "Retry ONN Submission" : "Submit to ONN"}</button> : null}</div></div>
        </form>

        <aside className="border-t border-[#d6e0e4] bg-[#f4f7f8] xl:border-l xl:border-t-0"><div className="flex items-center justify-between px-5 py-4 text-[9px] font-bold uppercase tracking-[0.08em]"><span className="text-[#f06b2b]">Live Preview</span><span className="text-[#176c83]">OSai News Network</span></div><div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#126a72] text-7xl font-bold tracking-[-0.08em] text-white sm:h-72"><span className="relative z-10">OS</span><span className="absolute h-28 w-[72%] rotate-[18deg] rounded-[50%] border border-[#b96d38]/70" /><span className="absolute h-28 w-[72%] -rotate-[18deg] rounded-[50%] border border-[#2b95a0]/80" /></div><article className="px-6 py-8 sm:px-8"><p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#168391]">{project || "OSai Briefing"}</p><h3 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.035em] text-[#082448]">{headline || "Your headline will appear here"}</h3><p className="mt-3 text-sm leading-6 text-[#657b8b]">{summary || "Your story summary will appear here as you write."}</p>{tags.trim() ? <p className="mt-5 text-[10px] text-[#168391]">{tags.split(",").map((tag) => `#${tag.trim().replaceAll(" ", "")}`).filter((tag) => tag !== "#").join("  ")}</p> : null}<p className="mt-6 text-[10px] text-[#7c8f9a]">{session?.displayName ?? "Authenticated contributor"} · {status === "submitted" ? "Submitted to ONN" : "Local preview"}</p></article></aside>
      </div>
    </section>
  );
}
