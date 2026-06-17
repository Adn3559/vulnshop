// app/api/commandes/[id]/route.ts — ✅ IDOR corrigé : on vérifie la propriété
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqldb";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ⚙️ Next 15+ : params est asynchrone

  // ✅ on identifie le demandeur via le cookie de session
  const sessionId = req.cookies.get("vulnshop_session")?.value;
  if (!sessionId) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const db = getDb();

  // ✅ on ne renvoie la commande QUE si elle appartient au demandeur
  const rows = db(
    "SELECT * FROM orders WHERE id = ? AND userId = ?",
    [Number(id), Number(sessionId)]
  ) as Array<{ id: number; userId: number; produit: string; montant: number }>;

  if (!rows.length) {
    // 404 volontaire : on ne dit pas "elle existe mais elle n'est pas à toi"
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  return NextResponse.json({ commande: rows[0] });
}