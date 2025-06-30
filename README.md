# Hackathon UTC x mc2i : Plateforme d'Entraide Étudiante

Ce projet est notre participation au Hackathon UTC x mc2i 2025. L'objectif est de créer une application web d'entraide pour les étudiants, conçue selon les principes du **numérique responsable** (écoconception et accessibilité).

## 🚀 Stack Technique

- **Framework :** [Next.js](https://nextjs.org/) (App Router)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Styling :** [Tailwind CSS](https://tailwindcss.com/)
- **Base de Données :** [SQLite](https://www.sqlite.org/index.html) (via un fichier local)
- **ORM :** [Prisma](https://www.prisma.io/)
- **Gestionnaire de paquets :** [npm](https://www.npmjs.com/)

Nous avons choisi cette stack pour sa **performance**, sa **légèreté** et son **écosystème robuste**, ce qui est idéal pour respecter les contraintes d'écoconception et de développement rapide d'un hackathon.

---

## 🛠️ Guide d'Installation et de Lancement

Suivez ces étapes pour configurer l'environnement de développement sur votre machine.

### Prérequis

- [Node.js](https://nodejs.org/en/) (v18 ou supérieur), qui inclut `npm` et `npx`.

### 1. Cloner le Dépôt

```bash
git clone https://gitlab.utc.fr/mdelmaer/hackathon.git
cd hackathon-utc-mc2i
```

### 2. Installer les Dépendances

Utilisez `npm` pour installer tous les paquets nécessaires listés dans `package.json`.

```bash
npm install
```

### 3. Configurer la Base de Données Locale

Nous utilisons Prisma avec une base de données SQLite locale. Le fichier de la base de données (`dev.db`) n'est pas versionné dans Git. Vous devez le générer sur votre machine.

La commande suivante, exécutée avec `npx`, va lire le fichier `prisma/schema.prisma` et créer votre fichier de base de données `dev.db` avec la bonne structure.

```bash
npx prisma db push
```

**Note :** Si le schéma de la base de données (`prisma/schema.prisma`) est mis à jour dans le futur, vous devrez simplement relancer cette commande pour synchroniser votre base locale.

### 4. Lancer le Serveur de Développement

Une fois l'installation terminée, vous pouvez lancer le projet.

```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

---

## ✅ Workflow de Développement

- **Base de Données :** Pour toute modification de la structure de la base de données, éditez le fichier `prisma/schema.prisma`, puis exécutez `npx prisma db push`.
- **Client Prisma :** Le client Prisma (pour interagir avec la DB en TypeScript) est automatiquement mis à jour après `db push`, mais vous pouvez le forcer avec `npx prisma generate`.
- **Branches Git :** Créez une nouvelle branche pour chaque fonctionnalité (`feat/login`, `fix/header-contrast`, etc.).

## 🧰 Outils Recommandés

Pour respecter nos objectifs de numérique responsable, veuillez installer et utiliser les extensions de navigateur suivantes :

- [**GreenIT-Analysis**](https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifkbfjcabnj) : Pour mesurer l'écoconception de nos pages.
- [**Axe DevTools**](https://www.deque.com/axe/devtools/) : Pour auditer l'accessibilité.
- [**W3C HTML Validator**](https://validator.w3.org/) : Pour valider la sémantique de notre code.
