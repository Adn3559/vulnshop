// app/api/login/route.ts — ⚠️ CODE VOLONTAIREMENT VULNÉRABLE (injection SQL) — labo
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqldb";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const db = getDb();

  // ⚠️ FAILLE : on COLLE les entrées dans la requête → injection SQL possible
  const sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  console.log("🔎 SQL exécuté :", sql); // pour VOIR l'injection dans le terminal

  const rows = db(sql) as Array<{ id: number; email: string; role: string }>;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Email ou mot de passe invalide" }, { status: 401 });
  }

  const user = rows[0];
  const res = NextResponse.json({ message: "Connecté", user });

  // ⚠️ FAILLE : cookie de session LISIBLE en JS (httpOnly:false) → volable par XSS
  res.cookies.set("vulnshop_session", String(user.id), { httpOnly: false, path: "/" });
  return res;
}