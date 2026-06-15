// app/commentaires/page.tsx — ⚠️ CODE VOLONTAIREMENT VULNÉRABLE (labo)
import { comments } from "@/lib/db";

export default function CommentairesPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Commentaires</h1>
      {comments.map((c) => (
        <div key={c.id}>
          <b>{c.author} :</b>{" "}
          {/* ⚠️ on injecte du HTML brut venu d'un utilisateur */}
          <span dangerouslySetInnerHTML={{ __html: c.html }} />
        </div>
      ))}
    </main>
  );
}