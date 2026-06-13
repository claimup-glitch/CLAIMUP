# ClaimUp – Guide de déploiement

## Structure des fichiers
```
claimup/
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── App.js        ← toute l'application ici
└── package.json
```

---

## Déploiement sur Vercel (10 minutes)

### Étape 1 – Crée le projet sur GitHub
1. Va sur [github.com](https://github.com) → crée un compte gratuit si besoin
2. Clique **"New repository"** → nomme-le `claimup` → **Create repository**
3. Sur ton ordinateur, copie les fichiers dans ce dossier
4. Dans le terminal :
   ```bash
   cd claimup
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/TON_USERNAME/claimup.git
   git push -u origin main
   ```

### Étape 2 – Déploie sur Vercel
1. Va sur [vercel.com](https://vercel.com) → **Sign up with GitHub**
2. Clique **"Add New Project"**
3. Sélectionne ton repo `claimup`
4. Vercel détecte React automatiquement → clique **Deploy**
5. En 2 minutes : ton site est en ligne sur `claimup.vercel.app` 🎉

### Étape 3 – Ton domaine claimup.fr
1. Achète `claimup.fr` sur [OVH](https://www.ovh.com/fr/domaines/) (~8€/an)
2. Dans Vercel → ton projet → **Settings** → **Domains**
3. Ajoute `claimup.fr`
4. Copie les serveurs DNS indiqués par Vercel dans ton compte OVH
5. Attendre 15-30 min → ton site est sur claimup.fr ✓

---

## Alternative sans terminal (plus simple)

1. Va sur [stackblitz.com](https://stackblitz.com)
2. Clique **"Create a project"** → **React**
3. Copie-colle le contenu de `src/App.js` dans l'éditeur
4. Clique **"Deploy"** → connecte GitHub → Vercel fait le reste

---

## Prochaines étapes recommandées
- [ ] Connecter un vrai formulaire (Tally.so gratuit)
- [ ] Ajouter DocuSign ou HelloSign pour la signature du mandat
- [ ] Créer une adresse contact@claimup.fr (Google Workspace ~6€/mois)
- [ ] Faire valider le modèle de mandat par un avocat

---

*Développé avec ClaimUp – commission 30% au succès uniquement*
