"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[] | null;
};

export default function ProblemsExplorer({
  problems,
}: {
  problems: Problem[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(problems.map((p) => p.category))),
  ];

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const text = [p.title, p.description, p.category, ...(p.tags ?? [])]
        .join(" ")
        .toLowerCase();

      return (
        text.includes(query.toLowerCase()) &&
        (category === "All" || p.category === category)
      );
    });
  }, [problems, query, category]);

  return (
    <>
      {/* Search */}
      <div className="problem-toolbar">
        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search challenges..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && <button onClick={() => setQuery("")}>×</button>}
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      {/* Result information */}
      <div className="problem-results">
        <div>
          <strong>{filtered.length}</strong>{" "}
          {filtered.length === 1 ? "challenge" : "challenges"} available
        </div>

        {category !== "All" && (
          <button className="clear-filter" onClick={() => setCategory("All")}>
            Clear filter
          </button>
        )}
      </div>

      {/* Cards */}
      <div className="challenge-grid">
        {filtered.map((problem, index) => (
          <article className="challenge-card" key={problem.id}>
            <div className="challenge-top">
              <div className="challenge-number">
                #{String(index + 1).padStart(2, "0")}
              </div>

              <span
                className={`difficulty ${problem.difficulty
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {problem.difficulty}
              </span>
            </div>

            <div className="category-label">{problem.category}</div>

            <h2>{problem.title}</h2>

            <p>{problem.description}</p>

            <div className="challenge-tags">
              {(problem.tags ?? []).map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>

            <div className="challenge-footer">
              <Link href={`/problems/${problem.id}`}>
                View Challenge
                <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">⌕</div>
          <h3>No challenges found</h3>
          <p>Try a different search term or remove the category filter.</p>
        </div>
      )}
    </>
  );
}
