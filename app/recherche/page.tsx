// app/recherche/page.tsx — ✅ XSS réfléchi corrigé : React échappe {q}
export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams; // ⚙️ Next 15+ : searchParams est asynchrone

  return (
    <main style={{ padding: 24 }}>
      <h1>Recherche</h1>
      {/* ✅ affichage ÉCHAPPÉ : le contenu de l'URL est du TEXTE, jamais du HTML */}
      <p>Résultats pour : {q}</p>
    </main>
  );
}