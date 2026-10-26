import { useEffect, useState } from "react";
import api from "../api/index.js";

const MOODS = [
  ["very_sad", "😞"], ["sad", "🙁"], ["neutral", "😐"], ["good", "🙂"], ["very_good", "😊"],
  ["anxious", "😬"], ["stressed", "😮‍💨"], ["calm", "😌"], ["happy", "😄"], ["angry", "😠"],
];

const PROMPTS = [
  "What's one thing that went better than you expected today?",
  "What is taking up the most space in your head right now?",
  "Write about a moment today when you felt okay.",
  "What would you tell a friend who felt the way you do?",
];

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState({ title: "", content: "", mood: "neutral", tags: "", status: "draft", is_shared_with_therapist: false });
  const [editingId, setEditingId] = useState(null);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  const prompt = PROMPTS[new Date().getDate() % PROMPTS.length];

  async function load() {
    setLoading(true);
    try {
      const res = await api.journals.list({ limit: 50 });
      setEntries(res.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    setError("");
    setSaved("");
    const payload = {
      title: editor.title,
      content: editor.content,
      mood: editor.mood,
      tags: editor.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: editor.status,
      is_shared_with_therapist: editor.is_shared_with_therapist,
    };
    try {
      if (editingId) {
        await api.journals.update(editingId, payload);
      } else {
        await api.journals.create(payload);
      }
      setEditor({ title: "", content: "", mood: "neutral", tags: "", status: "draft", is_shared_with_therapist: false });
      setEditingId(null);
      setSaved("Saved");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await api.journals.remove(id);
    if (editingId === id) setEditingId(null);
    load();
  }

  function edit(entry) {
    setEditingId(entry.id);
    setEditor({
      title: entry.title || "",
      content: entry.content || "",
      mood: entry.mood || "neutral",
      tags: (entry.tags || []).join(", "),
      status: entry.status || "draft",
      is_shared_with_therapist: Boolean(entry.is_shared_with_therapist),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const words = editor.content.trim() ? editor.content.trim().split(/\s+/).length : 0;

  return (
    <>
      <div className="page-head row-between rise">
        <div>
          <h1 className="mb-0">Journal</h1>
          <p className="muted mb-0">Write freely. This space is yours alone.</p>
        </div>
        <span className="badge badge-gold">🔒 Private to you</span>
      </div>

      <div className="grid rise rise-2" style={{ gridTemplateColumns: "1fr", gap: "var(--s-5)" }}>
        <div className="card card-warm">
          <p className="label" style={{ marginBottom: "0.15rem" }}>Today's prompt</p>
          <p className="mb-0" style={{ fontWeight: 600 }}>{prompt}</p>
        </div>

        <section className="journal-sheet" aria-label="Editor">
          {error && <div className="alert alert-error" role="alert" style={{ marginBottom: "var(--s-4)" }}><span>{error}</span></div>}
          <form onSubmit={save}>
            <div className="row-between" style={{ marginBottom: "var(--s-3)" }}>
              <h2 className="card-title" style={{ margin: 0 }}>
                {editingId ? "Edit entry" : new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
              </h2>
              <div className="row" style={{ gap: "var(--s-3)" }}>
                <span className="small muted">{words} words</span>
                {saved && <span className="small" style={{ color: "var(--success)" }}>{saved}</span>}
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="title">Title (optional)</label>
              <input className="input" id="title" value={editor.title}
                onChange={(e) => setEditor({ ...editor, title: e.target.value })}
                placeholder="Give it a name, or don't" />
            </div>

            <label className="sr-only" htmlFor="content">Journal entry</label>
            <textarea className="textarea" id="content" data-journal-editor value={editor.content}
              onChange={(e) => setEditor({ ...editor, content: e.target.value })}
              placeholder="Start wherever you are. A sentence counts." />

            <div className="field" style={{ marginTop: "var(--s-4)" }}>
              <span className="label">How did it feel?</span>
              <div className="mood-scale" role="group" aria-label="Mood">
                {MOODS.map(([k, v]) => (
                  <button className="mood" key={k} type="button" aria-label={k.replace("_", " ")}
                    aria-pressed={editor.mood === k}
                    onClick={() => setEditor({ ...editor, mood: k })}>{v}</button>
                ))}
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: "var(--s-3)" }}>
              <div className="field">
                <label className="label" htmlFor="tags">Tags (comma separated)</label>
                <input className="input" id="tags" value={editor.tags}
                  onChange={(e) => setEditor({ ...editor, tags: e.target.value })}
                  placeholder="study, sleep" />
              </div>
              <div className="field">
                <label className="label" htmlFor="status">Status</label>
                <select className="select" id="status" value={editor.status}
                  onChange={(e) => setEditor({ ...editor, status: e.target.value })}>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <label className="check" style={{ marginBottom: "var(--s-4)" }}>
              <input type="checkbox" checked={editor.is_shared_with_therapist}
                onChange={(e) => setEditor({ ...editor, is_shared_with_therapist: e.target.checked })} />
              <span>Share this entry with your therapist</span>
            </label>

            <div className="row-between" style={{ borderTop: "1px solid var(--line)", paddingTop: "var(--s-4)" }}>
              <p className="small muted mb-0">
                Drafts stay on your account until you save. Nothing appears in notifications.
              </p>
              <div className="row" style={{ gap: "var(--s-2)" }}>
                {editingId && (
                  <button className="btn btn-ghost btn-sm" type="button"
                    onClick={() => { setEditingId(null); setEditor({ title: "", content: "", mood: "neutral", tags: "", status: "draft", is_shared_with_therapist: false }); }}>
                    Cancel edit
                  </button>
                )}
                <button className="btn btn-primary btn-sm" type="submit">Save entry</button>
              </div>
            </div>
          </form>
        </section>

        <section>
          <h2 style={{ marginBottom: "var(--s-3)" }}>Recent entries</h2>
          {loading && <p className="muted">Loading entries…</p>}
          {!loading && entries.length === 0 && (
            <div className="card empty">
              <span className="icon-tile" aria-hidden="true">📝</span>
              <h2>No entries yet</h2>
              <p>Your first one can be a single sentence.</p>
            </div>
          )}
          <div className="grid grid-3">
            {entries.map((entry) => (
              <article className="card card-hover" key={entry.id}>
                <div className="row-between">
                  <span className="small muted">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                  <span className="badge">{entry.mood?.replace("_", " ")}</span>
                </div>
                <p className="card-title" style={{ marginTop: "var(--s-2)" }}>
                  {entry.title || "Untitled"}
                </p>
                <p className="small muted">{(entry.content || "").slice(0, 120)}…</p>
                <div className="tag-row" style={{ margin: "var(--s-3) 0" }}>
                  {(entry.tags || []).map((t) => <span className="badge badge-neutral" key={t}>{t}</span>)}
                  {entry.is_shared_with_therapist && <span className="badge badge-gold">Shared</span>}
                </div>
                <div className="row" style={{ gap: "var(--s-2)" }}>
                  <button className="btn btn-secondary btn-sm" type="button" onClick={() => edit(entry)}>Edit</button>
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => remove(entry.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
