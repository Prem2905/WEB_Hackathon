import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: problems } = await supabase
    .from("problems")
    .select("id,title,category,difficulty")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main>
      <section className="hero">
        <nav className="nav container">
          <div className="brand"><span className="brand-mark">B</span> BitShift</div>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/problems">Problem Statements</Link>
          </div>
        </nav>
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">HACK • BUILD • SHIFT</span>
            <h1>Turn bold ideas into <span>real impact.</span></h1>
            <p className="hero-copy">
              BitShift is a modern hackathon for builders, designers, and problem-solvers.
              Pick a challenge, form your team, and ship something that matters.
            </p>
            <div className="actions">
              <Link className="button primary" href="/problems">Explore Problems →</Link>
              <a className="button secondary" href="#about">Why BitShift?</a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orb orb-a" />
            <div className="orb orb-b" />
            <div className="code-card">
              <span>01</span><code>const future = build();</code>
              <span>02</span><code>shift(ideas, impact);</code>
              <span>03</span><code>ship();</code>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section container">
        <div className="section-head">
          <div><span className="eyebrow">THE CHALLENGE</span><h2>Problems worth solving.</h2></div>
          <Link href="/problems">View all →</Link>
        </div>
        <div className="problem-grid">
          {(problems ?? []).map((p) => (
            <article className="problem-card" key={p.id}>
              <div className="card-top"><span className="tag">{p.category}</span><span>{p.difficulty}</span></div>
              <h3>{p.title}</h3>
              <Link href={`/problems#${p.id}`}>View challenge →</Link>
            </article>
          ))}
          {(!problems || problems.length === 0) && (
            <div className="empty-card">Problem statements will appear here once published by the admin.</div>
          )}
        </div>
      </section>

      <footer className="footer"><div className="container">© {new Date().getFullYear()} BitShift Hackathon</div></footer>
    </main>
  );
}
