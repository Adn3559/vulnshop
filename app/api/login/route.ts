// app/api/login/route.ts — ✅ VERSION SÉCURISÉE FINALE
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/sqldb";
import { loginSchema } from "@/lib/validation";
import { autoriser } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // ✅ Correctif 3 — validation des entrées
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  // ✅ Correctif 9 — rate limiting par IP + email
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!autoriser(`${ip}:${email}`)) {
    return NextResponse.json(
      { error: "Trop de tentatives, réessaie plus tard" },
      { status: 429 }
    );
  }

  const db = getDb();

  // ✅ Correctif 2 — récupération PARAMÉTRÉE par email
  const rows = db("SELECT * FROM users WHERE email = ?", [email]) as Array<{
    id: number; email: string; password: string; role: string;
  }>;
  const user = rows[0];

  // ✅ Correctif 1 — comparaison bcrypt ; ✅ Correctif 4 — message neutre
  const motDePasseOk = user ? await bcrypt.compare(password, user.password) : false;
  if (!user || !motDePasseOk) {
    return NextResponse.json({ error: "Email ou mot de passe invalide" }, { status: 401 });
  }

  // ✅ Correctif 4 — réponse minimale (jamais le hash)
  const res = NextResponse.json({
    message: "Connecté",
    user: { id: user.id, email: user.email, role: user.role },
  });

  // ✅ Correctif 5 — cookie de session sûr
  res.cookies.set("vulnshop_session", String(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true en prod (HTTPS), permissif en dev local
    sameSite: "lax",
    path: "/",
  });
  return res;
}