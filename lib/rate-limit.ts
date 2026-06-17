// lib/rate-limit.ts — ✅ rate limiting EN MÉMOIRE (labo). En prod → Upstash/Redis.
type Entree = { count: number; resetAt: number };
const seau = new Map<string, Entree>();

const MAX = 5;                 // 5 tentatives
const FENETRE_MS = 60_000;     // par minute

// renvoie true si la tentative est AUTORISÉE, false si on bloque
export function autoriser(cle: string): boolean {
  const maintenant = Date.now();
  const e = seau.get(cle);

  if (!e || maintenant > e.resetAt) {
    seau.set(cle, { count: 1, resetAt: maintenant + FENETRE_MS });
    return true;
  }
  if (e.count >= MAX) return false; // seuil atteint → bloqué
  e.count++;
  return true;
}