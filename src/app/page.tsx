import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-subtle text-xs uppercase tracking-widest mb-8">
          Un espace pour deux
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-ink leading-tight mb-6 max-w-2xl">
          Vos découvertes,<br />partagées avec soin
        </h1>
        <p className="text-muted max-w-sm mx-auto leading-relaxed mb-12 text-sm">
          Films, livres, musiques, podcasts — un espace intime pour échanger ce qui compte vraiment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/recommendations"
            className="bg-ink text-surface px-8 py-3 rounded-full text-sm tracking-wide hover:bg-ink-soft transition-colors">
            Découvrir
          </Link>
          <Link
            href="/register"
            className="border border-ink/20 text-ink px-8 py-3 rounded-full text-sm tracking-wide hover:border-ink/40 transition-colors">
            Rejoindre
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl text-ink text-center mb-16">
          Comment ça marche
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              n: "1",
              title: "Partagez",
              desc: "Ajoutez une recommandation en quelques secondes — un film, un livre, une chanson.",
            },
            {
              n: "2",
              title: "Explorez",
              desc: "Retrouvez les découvertes de vos proches, organisées par univers.",
            },
            {
              n: "3",
              title: "Échangez",
              desc: "Un espace privé, sans algorithme. Juste vous et vos coups de cœur.",
            },
          ].map((step) => (
            <div key={step.n} className="text-center">
              <div className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center mx-auto mb-6">
                <span className="font-serif text-ink text-lg">{step.n}</span>
              </div>
              <h3 className="font-medium text-ink mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
