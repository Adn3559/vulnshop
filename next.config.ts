import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["alasql"],

  async headers() {
    return [
      {
        // s'applique à TOUTES les routes
        source: "/:path*",
        headers: [
          {
            // CSP basique : ne charge JS/CSS/etc. que depuis notre propre origine.
            // ('unsafe-inline' sur les styles car Next injecte du CSS inline en dev)
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'",
          },
          // Anti-clickjacking : interdit l'affichage du site dans une iframe.
          { key: "X-Frame-Options", value: "DENY" },
          // Empêche le navigateur de "deviner" un type de contenu (anti MIME-sniffing).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Limite les infos de provenance envoyées aux autres sites.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // HSTS : impose HTTPS (effet réel uniquement en prod, derrière HTTPS).
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
