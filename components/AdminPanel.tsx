"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[] | null;
  is_published: boolean;
};

export default function AdminPanel() {
  const supabase = createClient();
  const [session, setSession] = useState<any>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [editing, setEditing] = useState<Problem | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "AI",
    difficulty: "Medium",
    tags: "",
    is_published: true,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) =>
      setSession(s),
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) load();
  }, [session]);

  async function load() {
    const { data } = await supabase
      .from("problems")
      .select("*")
      .order("created_at", { ascending: false });
    setProblems(data ?? []);
  }

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setMessage(error ? error.message : "Signed in.");
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };
    const result = editing
      ? await supabase.from("problems").update(payload).eq("id", editing.id)
      : await supabase.from("problems").insert(payload);
    setMessage(result.error ? result.error.message : "Saved.");
    if (!result.error) {
      reset();
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this problem?")) return;
    const { error } = await supabase.from("problems").delete().eq("id", id);
    setMessage(error ? error.message : "Deleted.");
    if (!error) load();
  }

  function edit(p: Problem) {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      category: p.category,
      difficulty: p.difficulty,
      tags: (p.tags ?? []).join(", "),
      is_published: p.is_published,
    });
  }

  function reset() {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      category: "AI",
      difficulty: "Medium",
      tags: "",
      is_published: true,
    });
  }

  if (!session)
    return (
      <main className="auth-page">
        <form className="auth-card" onSubmit={login}>
          <span className="eyebrow">PRIVATE AREA</span>
          <h1>Admin login</h1>
          <p>Use the Supabase account created for the hackathon admin.</p>
          <input name="email" type="email" placeholder="Admin email" required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <button className="button primary" type="submit">
            Sign in
          </button>
          {message && <p className="message">{message}</p>}
        </form>
      </main>
    );

  return (
    <main className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="eyebrow">ADMIN PANEL</span>
            <h1>Manage problems.</h1>
          </div>
          <button
            className="button secondary"
            onClick={() => supabase.auth.signOut()}
          >
            Sign out
          </button>
        </div>
        <form className="editor" onSubmit={save}>
          <input
            placeholder="Problem title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Problem description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <div className="form-grid">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>AI & Web3</option>
              <option>HealthTech</option>
              <option>FinTech</option>
              <option>Disaster Management</option>
              <option>Blockchain & Cybersecurity</option>
              <option>E-Governance</option>
            </select>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <input
              placeholder="Tags: ai, web, social"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>
          <label className="check">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                setForm({ ...form, is_published: e.target.checked })
              }
            />{" "}
            Published
          </label>
          <div className="actions">
            <button className="button primary" type="submit">
              {editing ? "Update problem" : "Add problem"}
            </button>
            {editing && (
              <button
                className="button secondary"
                type="button"
                onClick={reset}
              >
                Cancel
              </button>
            )}
          </div>
          {message && <p className="message">{message}</p>}
        </form>
        <div className="admin-list">
          {problems.map((p) => (
            <div className="admin-row" key={p.id}>
              <div>
                <strong>{p.title}</strong>
                <span>
                  {p.category} · {p.difficulty} ·{" "}
                  {p.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="row-actions">
                <button onClick={() => edit(p)}>Edit</button>
                <button onClick={() => remove(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
