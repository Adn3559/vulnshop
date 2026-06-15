// app/api/login/route.ts — ⚠️ CODE VOLONTAIREMENT VULNÉRABLE (labo)
import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // On cherche l'utilisateur qui correspond
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    // ⚠️ message d'erreur trop bavard
    return NextResponse.json(
      { error: `Aucun utilisateur ${email} avec ce mot de passe` },
      { status: 401 }
    );
  }

  // ⚠️ on renvoie TOUT l'objet user, mot de passe compris
  return NextResponse.json({ message: "Connecté", user });
}