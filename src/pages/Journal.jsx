import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, fake, apiFetch } from "../api";

const PROMPTS = [
  "What's one thing that went better than you expected today?",
  "What's weighing on your mind right now?",
  "What do you need most today?",
  "What's something small that went well this week?",
  "What would make tomorrow feel a little easier?",
];

export default function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("okay");
  const [shared, setShared] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { items } = await api.journals();
        setEntries(items);
      } catch {
        setEntries(fake.journals());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const wordCountText = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.createJournal({
        userId: user?.id,
        title: title.trim() || "Untitled entry",
        body: draft,
        date: new Date().toISOString().split("T")[0],
        mood,
        shared,
      });
      setSaved(true);
      setEntries((prev) => [{ id: "new", userId: user?.id, title: title.trim() || "Untitled entry", body: draft, date: new Date().toISOString().split("T")[0], mood, status: "draft", shared }, ...prev]);
      setDraft("");
      setTitle("");
      setMood("okay");
      setShared(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container py-16">
        <div className="h-8 w-1/3 skeleton rounded-full mb-4"></div>
        <div className="h-6 w-1/2 skeleton rounded-full mb-8"></div>
        <div className="skeleton h-40 rounded-2xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 text-center">
        <p className="text-lg font-bold text-ink">{error}</p>
        <button className="btn mt-4">Try again</button>
      </div>
    );
  }

  const recent = entries.slice(0, 3);

  return (
    <div className="bg-cloud">
      <div className="container py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="small text-ink-muted">Write freely. This space is yours alone.</p>
            <h1 className="text-3xl font-extrabold leading-tight text-slate">Journal</h1>
          </div>
          <Link to="/dashboard">
            <button className="btn btn-secondary">New entry</button>
          </Link>
        </div>

        <div className="grid gap-5 mt-5">
          {/* Prompts + editor */}
          <div className="grid gap-5">
            <div className="card rounded-2xl border p-5">
              <div className="flex items-start gap-4">
                <span className="icon-tile" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.1.9 1.8V17h5.2v-1.3c0-.7.3-1.3.9-1.8A6 6 0 0 0 12 3z"/><path d="M10 21h4"/></svg>
                </span>
                <div>
                  <p className="label">Today's prompt</p>
                  <p className="font-bold text-slate">{PROMPTS[Math.floor(Math.random() * PROMPTS.length)]}</p>
                </div>
              </div>
            </div>

            <section className="journal-sheet rounded-2xl border p-5" aria-labelledby="editor-h">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 id="editor-h" className="card-title">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</h2>
                  <p className="small italic text-ink-soft">Feeling: {mood}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <span>{wordCount} words</span>
                  {saved && <span className="text-mint font-bold">Saved ✓</span>}
                </div>
              </div>

              <div className="field mt-3">
                <label className="label" htmlFor="entry">Your entry</label>
                <textarea
                  className="field-input"
                  id="entry"
                  rows={8}
                  placeholder="Start wherever you are. A sentence counts."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="btn btn-ghost btn-sm">Mood</button>
                    <button type="button" className="btn btn-ghost btn-sm">Topic</button>
                    <button type="button" className="btn btn-ghost btn-sm">Attach</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="small text-ink-soft">
                      <input
                        type="checkbox"
                        checked={shared}
                        onChange={(e) => setShared(e.target.checked)}
                      />
                      <span className="ml-1 text-ink-soft">Share with therapist</span>
                    </label>
                    <button type="button" className="btn btn-secondary btn-sm">Preview</button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
                <p className="small text-ink-muted">
                  Drafts save locally on this device — nothing is shared with your therapist unless you choose to share it.
                </p>
                <button type="submit" className="btn btn-primary btn-sm" onClick={handleSave}>
                  Save entry
                </button>
              </div>
            </section>
          </div>

          {/* Recent entries */}
          <section aria-labelledby="recent-h">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="recent-h" className="text-xl font-extrabold text-slate">Recent entries</h2>
              <Link to="/journal">
                <span className="small text-brand font-bold hover:underline">Search entries</span>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {recent.map((e) => (
                <article key={e.id} className="card rounded-2xl border p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="small text-ink-muted">{e.date || "Today"}</span>
                    <span className="badge">{e.mood || "okay"}</span>
                  </div>
                  <h3 className="mt-2 card-title">{e.title || "Untitled"}</h3>
                  <p className="small text-ink-soft line-clamp-2">{e.body?.slice(0, 100) || "No entry content yet…"}</p>
                  <Link to="#" className="small text-brand font-bold hover:underline">Read entry</Link>
                </article>
              ))}
            </div>
            <div className="alert alert-info mt-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
              <span><strong>Kept private</strong> Journal content never appears in notifications, lock-screen previews or shared links.</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
