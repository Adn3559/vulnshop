// app/api/csrf/route.ts — ✅ délivre un jeton anti-CSRF (cookie lisible, à renvoyer en en-tête)
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function GET() {
  const token = randomUUID();
  const res = NextResponse.json({ csrfToken: token });
  // cookie LISIBLE en JS exprès : le front doit le relire pour le renvoyer en en-tête
  res.cookies.set("csrf", token, { httpOnly: false, sameSite: "lax", path: "/" });
  return res;
}