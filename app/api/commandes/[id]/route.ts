// app/api/commandes/[id]/route.ts — ⚠️ IDOR : aucune vérification de propriété — labo
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqldb";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ⚙️ en Next 15+, params est asynchrone → on l'attend
  const db = getDb();

  // ⚠️ FAILLE (IDOR) : on renvoie la commande SANS vérifier à QUI elle appartient
  const rows = db("SELECT * FROM orders WHERE id = ?", [Number(id)]);
  if (!rows.length) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  return NextResponse.json({ commande: rows[0] });
}