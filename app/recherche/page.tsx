// app/recherche/page.tsx — ⚠️ XSS RÉFLÉCHI : on réaffiche "q" sans le nettoyer — labo
export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams; // ⚙️ Next 15+ : searchParams est asynchrone

  return (
    <main style={{ padding: 24 }}>
      <h1>Recherche</h1>
      {/* ⚠️ FAILLE : le texte de l'URL est injecté en HTML BRUT */}
      <p dangerouslySetInnerHTML={{ __html: `Résultats pour : ${q}` }} />
    </main>
  );
}