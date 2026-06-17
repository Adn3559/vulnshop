// app/api/produits/route.ts — ✅ requête PARAMÉTRÉE (plus d'injection SQL)
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqldb";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const db = getDb();

  // ✅ le texte de recherche est passé comme DONNÉE (paramètre ?), jamais collé dans le SQL
  const motif = `%${q}%`;
  const rows = db("SELECT id, nom, prix FROM produits WHERE nom LIKE ?", [motif]);

  return NextResponse.json({ resultats: rows });
}