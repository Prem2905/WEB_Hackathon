 "use client";

import { useMemo, useState } from "react";

type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[] | null;
};

export default function ProblemsExplorer({ problems }: { problems: Problem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(problems.map(p => p.category)))];

  const filtered = useMemo(() => problems.filter(p => {
    const haystack = [p.title, p.description, p.category, ...(p.tags ?? [])].join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase()) && (category === "All" || p.category === category);
  }), [problems, query, category]);

  return (
    <>
      <div className="filters">
        <input aria-label="Search problems" placeholder="Search problem statements..." value={query} onChange={e => setQuery(e.target.value)} />
        <select aria-label="Filter category" value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <p className="result-count">{filtered.length} challenge{filtered.length === 1 ? "" : "s"}</p>
      <div className="problem-grid large">
        {filtered.map(p => (
          <article className="problem-card" id={p.id} key={p.id}>
            <div className="card-top"><span className="tag">{p.category}</span><span>{p.difficulty}</span></div>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <div className="tags">{(p.tags ?? []).map(t => <span key={t}>#{t}</span>)}</div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <div className="empty-card">No matching problems. Try another search or category.</div>}
    </>
  );
}
