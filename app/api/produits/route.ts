// app/api/produits/route.ts — ⚠️ recherche VULNÉRABLE (injection SQL / UNION) — labo
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqldb";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const db = getDb();

  // ⚠️ FAILLE : concaténation directe du texte de recherche
  const sql = `SELECT id, nom, prix FROM produits WHERE nom LIKE '%${q}%'`;
  console.log("🔎 SQL exécuté :", sql);

  try {
    const rows = db(sql);
    return NextResponse.json({ resultats: rows });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}