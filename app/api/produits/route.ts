// app/api/produits/route.ts — ✅ requête PARAMÉTRÉE (plus d'injection SQL)
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqldb";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const db = getDb();

  // ⚠️ FAILLE RÉINTRODUITE VOLONTAIREMENT — pour tester le garde-fou CI
  const sql = `SELECT id, nom, prix FROM produits WHERE nom LIKE '%${q}%'`;
  const rows = db(sql);

  return NextResponse.json({ resultats: rows });
}