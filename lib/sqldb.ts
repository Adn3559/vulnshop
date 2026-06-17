// lib/sqldb.ts — un VRAI moteur SQL en mémoire (labo). alasql = SQL en pur JS, zéro compilation native.
import alasql from "alasql";

let prete = false;

export function getDb() {
  if (!prete) {
    alasql("CREATE TABLE IF NOT EXISTS users    (id INT, email STRING, password STRING, role STRING)");
    alasql("CREATE TABLE IF NOT EXISTS orders   (id INT, userId INT, produit STRING, montant INT)");
    alasql("CREATE TABLE IF NOT EXISTS produits (id INT, nom STRING, prix INT)");

    // on repart propre à chaque (re)chargement du module
    alasql("DELETE FROM users");
    alasql("DELETE FROM orders");
    alasql("DELETE FROM produits");

// ✅ mots de passe HACHÉS (bcrypt). Plus jamais de clair en base.
// (remplace les hash ci-dessous par CEUX que ton script a affichés)
    alasql("INSERT INTO users VALUES (1,'alice@vulnshop.test','$2b$10$aFLgzGRYyUCRuHuc.qA1Ee9bqDIcoCk2YdSGK8DlyK2DbbMicSfMG','user')");
    alasql("INSERT INTO users VALUES (2,'bob@vulnshop.test','$2b$10$Lnx.stdnkJvb2pi8Nj/P.v0KIsDwZOjR6maAddPz6oLwNxvDmMq2','user')");
    alasql("INSERT INTO users VALUES (3,'admin@vulnshop.test','$2b$10$IbEazz35VJDKWISFpWyLV.XHyoCFqRK9XqCg4uWvjNwIqdCaPQc.K','admin')");

    alasql("INSERT INTO orders VALUES (1,1,'Clavier mécanique',89)");
    alasql("INSERT INTO orders VALUES (2,2,'Casque audio',149)");
    alasql("INSERT INTO orders VALUES (3,3,'Licence PRO (compte admin)',499)");

    alasql("INSERT INTO produits VALUES (1,'Clavier mécanique',89)");
    alasql("INSERT INTO produits VALUES (2,'Casque audio',149)");
    alasql("INSERT INTO produits VALUES (3,'Souris ergonomique',39)");

    prete = true;
  }
  return alasql; // alasql est appelable : db("SELECT ...")
}