// lib/db.ts — fausse base de données en mémoire (pour le labo uniquement)
export type User = { id: number; email: string; password: string; role: string };
export type Comment = { id: number; author: string; html: string };

export const users: User[] = [
  { id: 1, email: "alice@vulnshop.test", password: "azerty123", role: "user" },
  { id: 2, email: "bob@vulnshop.test",   password: "motdepasse", role: "user" },
  { id: 3, email: "admin@vulnshop.test", password: "admin",      role: "admin" },
];

export const comments: Comment[] = [
  { id: 1, author: "Alice", html: "Super boutique !" },
];