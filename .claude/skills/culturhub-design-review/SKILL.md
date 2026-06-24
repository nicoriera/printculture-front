---
name: culturhub-design-review
description: Revue visuelle des écrans CULTURHUB (printculture-next) — lance l'app, capture chaque écran via le preview MCP, et confronte le rendu à la maquette, aux design tokens et à l'accessibilité. Utiliser après un changement d'UI, avant un commit/PR, ou pour auditer un écran.
---

# Revue design CULTURHUB

Équivalent « Design Review » d'un vrai process design, mais qui réutilise l'existant du
projet au lieu de regénérer tokens/IA. **Lecture seule par défaut** : produit des findings ;
n'applique des corrections que si on le demande.

## 0. Pré-requis
Racine = `printculture-next/`. Stack lancée via `.claude/launch.json` — voir le skill
[`culturhub-run`]. Login de seed : `marie@example.com` / `password`.

## 1. Capturer les écrans (preview MCP)
1. `preview_start next-dev` (et `supabase` si la DB n'est pas up — cf. `culturhub-run`).
2. Pour chaque écran, naviguer puis `preview_screenshot` :
   - `/` déconnecté → **onboarding** ; `/` connecté → **feed** (onglets *Pour vous* / *Pour moi*)
   - `/login`, `/register`, `/recommendations/[id]` (détail), `/echanges` (chat), `/recherche`, `/profil`
   - Se connecter via le formulaire (`preview_fill` #email/#password puis submit) pour les écrans protégés.
3. Tester aussi un **état vide** (compte sans reco) et un **état chargé** quand c'est pertinent.

## 2. Confronter à 3 références
- **Maquette d'origine** : les 4 écrans fournis (onboarding sombre, feed à cartes, détail
  `bg-ink` éditorial, chat à bulles). Écart de structure/hiérarchie = finding.
- **Design tokens** (`src/app/globals.css`) : tout doit utiliser `surface`/`ink`/`ink-soft`/
  `rose`/`rose-light`/`muted`/`subtle` et `bg-category-*`. Repérer tout hex en dur, toute
  couleur hors palette, incohérence de rayon/typo (serif `DMSerifText` titres, `Poppins` corps).
- **Cohérence inter-écrans** : mêmes composants partagés (`Tabs`, `FeedCard`, avatar
  `getInitial`), même rythme d'espacement, même barre de nav 5 onglets.

## 3. Check accessibilité (rapide)
- Contraste texte/fond (viser WCAG AA : 4.5:1 texte normal). Attention au `subtle` (#A8A39B)
  sur `surface` clair et au texte clair sur `rose`.
- Cibles tactiles ≥ 44px (boutons de nav, FAB, icônes bookmark/partage).
- Champs avec `<label>`, images avec `alt`, focus visible au clavier.
- Pour un audit formel, déléguer à la skill **`design:accessibility-review`** (WCAG 2.1 AA).
  Pour une critique UX structurée, **`design:design-critique`**.

## 4. Restituer
Liste de findings ordonnés par sévérité : `écran — problème — réf (maquette/token/a11y) —
correction proposée`. Verdict : **conforme** / **conforme avec réserves** / **à corriger**.
Si on demande d'appliquer : faire les retouches en réutilisant tokens et composants existants,
puis `type-check` + `lint` et re-screenshot pour confirmer.

> Note preview : éditer `next.config.ts` redémarre le serveur (cache `.next`) ; après un
> `pnpm build` lancé pendant le dev, nettoyer `.next` et relancer `next-dev` si erreurs ENOENT.
