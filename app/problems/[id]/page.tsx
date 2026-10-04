import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProblemDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: problem, error } = await supabase
    .from("problems")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !problem) {
    notFound();
  }

  return (
    <main>
      <header className="sub-hero">
        <div className="container">
          <Link href="/problems" className="back">
            ← Back to Problems
          </Link>

          <span className="eyebrow">{problem.category}</span>

          <h1>{problem.title}</h1>

          <div className="problem-meta">
            <span>{problem.difficulty}</span>
            <span>•</span>
            <span>{problem.tags?.length ?? 0} tags</span>
          </div>
        </div>
      </header>

      <section className="section container">
        <article className="detail-card">
          <h2>Problem Statement</h2>

          <p className="detail-description">{problem.description}</p>

          {problem.tags && problem.tags.length > 0 && (
            <div className="tags">
              {problem.tags.map((tag: string) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}

          <div className="detail-section">
            <h2>Challenge Details</h2>

            <p>
              Build a practical and innovative solution for this challenge. Your
              solution should clearly explain the problem, approach, technology
              used, and expected impact.
            </p>
          </div>

          <Link href="/problems" className="button primary">
            ← Explore Other Problems
          </Link>
        </article>
      </section>
    </main>
  );
}
