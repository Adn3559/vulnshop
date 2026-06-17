// lib/validation.ts — ✅ schémas de validation des entrées (garde-frontière)
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),       // doit ressembler à un email
  password: z.string().min(1),     // non vide
});