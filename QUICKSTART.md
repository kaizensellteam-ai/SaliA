# 🚀 SaliA — Quick Start (2 minutes)

## Setup initial (une seule fois)

```bash
cd /Users/collotnoah/SalIA
bash setup.sh
```

Réponds aux questions pour configurer ta clé API Anthropic.

---

## Pour chaque appel : 3 étapes (20 minutes total)

### 1️⃣ Génère l'analyse (15 min)
Utilise ton prompt habituel avec Claude pour analyser l'appel.
Sauvegarde le résultat en `.txt` :
```
noah-20-janvier-2025.txt
```

### 2️⃣ Convertis en variables (30 secondes)
```bash
python3 convert-analysis.py noah-20-janvier-2025.txt
```

→ Crée automatiquement : `noah-20-janvier-2025-variables.txt`

### 3️⃣ Génère le dashboard (1 minute)
```bash
open salia-filler.html
```

- Upload `salia-template.html`
- Colle les variables du fichier `-variables.txt`
- Clique **"⚡ Générer le Dashboard"**
- Le fichier HTML final se télécharge

---

## 📝 Exemple complet

```bash
# 1. Après avoir généré l'analyse avec Claude
# Sauvegarde-la en tant que : laetitia.txt

# 2. Conversion
python3 convert-analysis.py laetitia.txt
# → Crée laetitia-variables.txt

# 3. Ouvrir le filler
open salia-filler.html
# Colle les variables → Clique "Générer"
# → salia-feedback-laetitia-2025-01-20.html téléchargé
```

---

## ✅ Vérification

Le script fonctionne si tu vois ceci :

```
📖 Lecture du fichier : mon-appel.txt
   → 15234 caractères
🔄 Conversion en cours...
✅ Variables générées : mon-appel-variables.txt

--- Aperçu ---
NOM_CLIENT = Noah
TYPE_APPEL = R2 — Closing Call
...
```

---

## ❌ Problèmes courants

### "ANTHROPIC_API_KEY non trouvée"
```bash
export ANTHROPIC_API_KEY='sk-ant-...'
```

### "Fichier non trouvé"
Utilise le chemin complet :
```bash
python3 convert-analysis.py ~/Downloads/mon-appel.txt
```

### Le filler ne génère rien
Assure-toi que les variables sont au bon format :
```
NOM_CLIENT = Noah
TYPE_APPEL = R2 — Closing Call
...
```
(Sans guillemets, une variable par ligne)

---

## 📚 Documentation complète

Voir `README.md` pour tous les détails et options.
