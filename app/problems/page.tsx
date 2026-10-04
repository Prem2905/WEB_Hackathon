import { createClient } from "@/lib/supabase/server";
import ProblemsExplorer from "@/components/ProblemsExplorer";

export const dynamic = "force-dynamic";

export default async function ProblemsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("problems")
    .select("id,title,description,category,difficulty,tags")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main>
      <header className="sub-hero">
        <div className="container">
          <a href="/" className="back">
            ← BitShift
          </a>

          <div className="eyebrow">BITSHIFT HACKATHON</div>

          <h1>
            Pick your <span>challenge.</span>
          </h1>

          <p>
            Explore real-world problems, find your challenge, and build
            something worth shipping.
          </p>
        </div>
      </header>

      <section className="section container">
        <ProblemsExplorer problems={data ?? []} />
      </section>
    </main>
  );
}
