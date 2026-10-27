import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, fake, apiFetch } from "../api";

export default function Therapists() {
  const { therapistId } = useParams();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [empty, setEmpty] = useState(false);

  const focusOptions = [
    "Anxiety",
    "Stress",
    "Relationships",
    "Depression",
    "Grief",
    "School pressure",
    "Identity",
    "Trauma",
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = {};
        if (search) params.q = search;
        if (filter !== "all") params.filter = filter;
        if (sortBy === "price-low") params.sortBy = "price-low";
        else if (sortBy === "experience") params.sortBy = "experience";
        else if (sortBy === "rating") params.sortBy = "rating";
        const { items: list, total: t } = await api.therapists(params);
        setItems(list);
        setTotal(t);
        setEmpty(list.length === 0);
      } catch (err) {
        setError(err.message);
        setItems(fake.therapists({ sortBy }).items);
        setTotal(fake.therapists({ sortBy }).items.length);
        setEmpty(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search, filter, sortBy]);

  const filterCount = items.length;

  return (
    <div className="bg-cloud">
      <div className="container py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="small text-ink-muted">Find someone who gets it</p>
            <h1 className="text-3xl font-extrabold leading-tight text-slate">Find a therapist</h1>
            <p className="small text-ink-soft">Verified professionals who work with young people. Pick one that fits how you want to talk, then send a booking request.</p>
          </div>
          <Link to="/therapist/apply">
            <button className="btn btn-primary">Become a therapist</button>
          </Link>
        </div>

        {/* Search + filters */}
        <section className="card rounded-2xl border p-5 mt-5" aria-labelledby="filters-h">
          <h2 id="filters-h" className="sr-only">Filters</h2>
          <div className="field">
            <label className="label" htmlFor="search">Search by name or focus area</label>
            <input
              className="field-input"
              id="search"
              type="search"
              placeholder="Try “anxiety”, “students”, “sleep”…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by focus area">
            <button
              type="button"
              className={`chip ${filter === "all" ? "ring-2 ring-brand" : ""}`}
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
            >
              All
            </button>
            {focusOptions.map((f) => (
              <button
                key={f}
                type="button"
                className={`chip ${filter === f ? "ring-2 ring-brand" : ""}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <p className="small text-ink-soft">
              <strong className="text-slate">{filterCount}</strong> therapist{filterCount !== 1 ? "s" : ""} match
            </p>
            <div className="field">
              <label className="label" htmlFor="sort">Sort</label>
              <select
                className="field-input"
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="match">Best match</option>
                <option value="price-low">Price: low to high</option>
                <option value="experience">Experience: most</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results */}
        {loading && <div className="flex justify-center py-16"><div className="skeleton h-10 w-10 rounded-full"></div></div>}

        {error && <div className="card rounded-2xl border p-6 text-center"><p className="text-sm text-ink-soft">{error}</p></div>}

        {!loading && !error && items.length === 0 && (
          <div className="card rounded-2xl border p-10 text-center">
            <span className="icon-tile" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            </span>
            <h2 className="mt-4 card-title">No matches yet</h2>
            <p className="small text-ink-soft">Try a different filter or clear your search. New therapists join every week.</p>
            <button
              type="button"
              className="btn btn-secondary mt-4"
              onClick={() => {
                setFilter("all");
                setSearch("");
              }}
            >
              Show everyone
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <article key={t.id} className="card rounded-2xl border p-5 transition hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="avatar avatar-lg" aria-hidden="true">{t.name?.charAt(0) || "?"}</span>
                    <div>
                      <h2 className="card-title">{t.name}</h2>
                      <p className="small text-ink-soft">
                        {t.role || "Therapist"} · {t.experience || 0} yrs
                      </p>
                    </div>
                  </div>
                  <span className={t.verified ? "badge badge-success" : "badge badge-neutral"}>{t.verified ? "Verified" : "Pending"}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {t.focus?.map((f) => <span key={f} className="badge">{f}</span>)}
                </div>

                <p className="small text-ink-soft mt-3">{t.description || "Impactful life transitions, family, health, performance"}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-brand">KES {t.hourlyRate || 0}</span>
                    <span className="text-ink-muted">/ session</span>
                  </div>
                  <span className="small text-ink-muted">{t.location || "Virtual"}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/therapists/${t.id}`}>
                    <button className="btn btn-primary btn-block">View profile</button>
                  </Link>
                  {t.accepting && (
                    <Link to={`/therapists/${t.id}`}>
                      <button className="btn btn-gold btn-block">Book session</button>
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
