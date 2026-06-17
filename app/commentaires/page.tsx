// app/commentaires/page.tsx — ✅ XSS stocké corrigé : React échappe {c.html}
import { comments } from "@/lib/db";

export default function CommentairesPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Commentaires</h1>
      {comments.map((c) => (
        <div key={c.id}>
          <b>{c.author} :</b>{" "}
          {/* ✅ affiché comme TEXTE : le <img onerror> n'est plus exécuté */}
          <span>{c.html}</span>
        </div>
      ))}
    </main>
  );
}