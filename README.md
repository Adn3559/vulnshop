# 🛡️ VulnShop — Labo de sécurité applicative

VulnShop est une application e-commerce fictive construite volontairement avec des failles de sécurité, dans le cadre d'une formation **OWASP & Secure Coding**. Le projet illustre un cycle complet : **construire une app vulnérable → l'exploiter comme un attaquant → l'auditer avec des outils → corriger chaque faille à la racine → automatiser la détection en CI/CD.**

> ⚠️ **Usage strictement pédagogique.** Cette application contient (ou a contenu) des vulnérabilités intentionnelles. Elle ne doit jamais être déployée en production ni exposée publiquement.

## Stack technique

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **alasql** — moteur SQL en mémoire, 100 % JavaScript (zéro compilation native, adapté à WSL)
- **bcryptjs** — hachage des mots de passe
- **Zod** — validation des entrées
- **ESLint** (+ `eslint-plugin-security`, `eslint-plugin-react`), **Semgrep**, **CodeQL** — analyse statique

## Démarrage

```bash
npm install
npm run dev
```

L'application est servie sur [http://localhost:3000](http://localhost:3000).

---

## 📅 Démarche du labo

### Jour 1 — Construire puis exploiter

Construction de VulnShop avec 8 failles volontaires (mots de passe en clair, API qui renvoie le mot de passe, messages d'erreur bavards, absence de rate limiting et de validation, `dangerouslySetInnerHTML`, mot de passe admin trivial, absence de logs), puis ajout d'un vrai moteur SQL pour rendre les failles réellement exploitables.

Exploitation réalisée en conditions réelles : bypass de login par injection SQL, exfiltration de la base utilisateurs via une injection `UNION`, vol de cookie de session par XSS stocké et réfléchi, brute force du mot de passe administrateur.

### Jour 2 — Audit automatique

Passage de l'application au crible de plusieurs outils, pour mesurer ce que chacun voit — et surtout ce qu'il ne voit pas :

| Outil | Détecte | Angle mort |
|---|---|---|
| `npm audit` | CVE connues dans les dépendances | Aveugle au code applicatif |
| ESLint + plugins sécurité | Patterns dangereux ciblés (ex. `dangerouslySetInnerHTML`) | Pas d'analyse de flux de données |
| Semgrep (règle maison) | Injections SQL via un motif `pattern-regex` écrit pour ce projet | Limité à ce qui est explicitement décrit |
| CodeQL (CI GitHub Actions) | Analyse de flux de données (injections, fuite de données sensibles dans les logs) | Failles de logique métier (IDOR, CSRF) |

**Leçon retenue :** aucun outil ne voit tout. La revue humaine reste indispensable, en particulier pour les failles de contrôle d'accès.

### Jour 3 — Corriger à la racine

Application de **9 correctifs**, chacun validé par la méthode AVANT/APRÈS puis vérifié en rejouant l'attaque du Jour 1 (qui doit échouer) tout en confirmant que l'usage normal fonctionne toujours (non-régression).

| # | Faille | OWASP Top 10 | Correctif |
|---|---|---|---|
| 1 | Mots de passe en clair | A02 – Cryptographic Failures | Hachage **bcrypt** (salage + lenteur volontaire) |
| 2 | Injection SQL (login, recherche produits) | A03 – Injection | **Requêtes paramétrées** (`?`) au lieu de la concaténation |
| 3 | Absence de validation des entrées | A03 / A04 | **Zod** (`safeParse`) → 400 si la requête est mal formée |
| 4 | Fuite du mot de passe haché + message d'erreur trop précis | A01 / A02 | Réponse minimale (`id`, `email`, `role`) + message neutre |
| 5 | Cookie de session volable par XSS | A05 / A07 | `httpOnly` + `secure` + `sameSite: lax` |
| 6 | XSS stocké et réfléchi | A03 – Injection | Suppression de `dangerouslySetInnerHTML` → affichage échappé par défaut de React |
| 7 | IDOR sur les commandes | A01 – Broken Access Control | Vérification de **propriété** (`AND userId = ?`) côté serveur |
| 8 | CSRF sur la mise à jour du profil | A01 – Broken Access Control | Jeton anti-CSRF (*double-submit cookie*) + `SameSite` |
| 9 | Absence de limite sur le login | A07 – Identification and Authentication Failures | **Rate limiting** par IP + email (5 tentatives / minute) |

> En production, plusieurs de ces parades se délègueraient à la plateforme : Row Level Security côté base de données pour le contrôle d'accès, un store partagé (Redis/Upstash) pour le rate limiting, HTTPS systématique via l'hébergeur.

---

## 🧠 Ce que ce projet illustre

Malgré la diversité des failles couvertes, les correctifs reposent sur une poignée de principes réutilisables :

- **Valider** toute entrée avant de la traiter (Zod, garde-frontière).
- **Séparer le code et les données** : jamais de SQL construit par concaténation, jamais de HTML utilisateur injecté brut.
- **Vérifier les droits côté serveur**, jamais côté client, et ne jamais se fier au seul cookie de session pour une action sensible.
- **Moindre privilège** : ne renvoyer que les données strictement nécessaires.
- **Secure by default** : un cookie non sécurisé, une erreur trop bavarde ou un endpoint sans limite de débit sont des choix — la sécurité doit être l'option par défaut, pas une option.

## 📂 Structure du projet

```
vulnshop/
├── app/
│   ├── api/
│   │   ├── login/          → authentification
│   │   ├── produits/       → recherche produits
│   │   ├── commandes/[id]/ → consultation d'une commande (contrôle d'accès)
│   │   ├── profil/         → mise à jour de profil (protection CSRF)
│   │   └── csrf/           → distribution du jeton anti-CSRF
│   ├── recherche/          → page de résultats (XSS réfléchi corrigé)
│   └── commentaires/       → page d'avis clients (XSS stocké corrigé)
├── lib/
│   ├── sqldb.ts            → moteur SQL en mémoire (alasql) + seed
│   ├── db.ts                → données de test (utilisateurs, commentaires)
│   ├── validation.ts        → schémas Zod
│   └── rate-limit.ts        → limiteur de tentatives en mémoire
├── regles/
│   └── sqli.yml             → règle Semgrep maison (détection d'injection SQL)
└── .github/workflows/
    └── codeql.yml            → analyse CodeQL en CI
```

---

## 📌 Avancement

- [x] Jour 1 — Construction de l'application vulnérable + exploitation des failles
- [x] Jour 2 — Audit automatique (npm audit, ESLint, Semgrep, CodeQL)
- [x] Jour 3 (matin) — Correction des 9 failles
- [ ] Jour 3 (après-midi) — Durcissement (en-têtes de sécurité) + pipeline CI/CD bloquant en cas de régression

---

*Projet réalisé dans le cadre d'une formation en sécurité applicative. Toute vulnérabilité présente dans l'historique Git est intentionnelle et documentée à des fins pédagogiques.*
