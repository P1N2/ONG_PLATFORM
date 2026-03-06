ONG Web Application

Description

Cette application web a été développée pour permettre à une ONG de disposer d'un site vitrine moderne avec une gestion de contenu.

L'application permet de :

* Présenter l'organisation
* Afficher les services proposés
* Publier les activités avec images
* Permettre aux visiteurs de contacter l'ONG
* Gérer les contenus depuis un espace administrateur

Le projet utilise une architecture avec **séparation entre Frontend et Backend**.

Technologies utilisées

Frontend

* Next.js
* TypeScript
* CSS / Tailwind

Backend

* Node.js
* Express

Base de données

PostgreSQL

 Architecture du projet


project-root/

Backend/
 ├ node_modules
 ├ routes
 ├ .env
 ├ db.js
 ├ schema.sql
 ├ server.js
 ├ package.json

frontend/
 ├ public
 ├ src
 │   ├ app
 │   │   ├ (public)
 │   │   ├ admin
 │   │   ├ favicon.ico
 │   │   ├ globals.css
 │   │   └ layout.tsx
 │   ├ components
 │   ├ lib
 │   └ types
 ├ next.config.mjs
 ├ package.json

Installation

Cloner le projet

git clone https://github.com/P1N2/ONG_PLATFORM.git


Backend


cd Backend
npm install
npm start


Le serveur démarre sur :


http://localhost:5000

 Frontend

cd frontend
npm install
npm run dev

Application disponible sur :


http://localhost:3000



Base de données

Le fichier `schema.sql` contient la structure complète de la base de données PostgreSQL.

Importer le schéma dans votre base PostgreSQL avant de lancer le serveur.



Fonctionnalités

* Site vitrine de l'ONG
* Liste des services
* Publication des activités avec images
* Formulaire de contact
* Interface administrateur ( disponible sur http://localhost:3000/admin/dashboard)
* API REST pour la communication frontend/backend

