# SaliA — Workflow Automatisé de Feedback

Workflow à 3 étapes pour générer des dashboards de feedback de calls de vente.

## 📋 Vue d'ensemble

**Étape 1** → Générer une analyse textuelle (avec ton prompt habituel)
**Étape 2** → Convertir l'analyse en variables (script `convert-analysis.py`) ← **NOUVEAU**
**Étape 3** → Injecter les variables dans le filler HTML et générer le dashboard

---

## ✅ Installation & Configuration

### 1. Installer les dépendances

```bash
pip install anthropic
```

### 2. Configurer ta clé API

**Option A : Variable d'environnement (recommandé)**
```bash
export ANTHROPIC_API_KEY='sk-ant-...'
```

**Option B : Fichier `.env` à la racine**
```
ANTHROPIC_API_KEY=sk-ant-...
```

Alors charge le `.env` avant de lancer le script :
```bash
source .env
python3 convert-analysis.py mon-analyse.txt
```

---

## 🚀 Utilisation

### Étape 1 : Générer l'analyse

Utilise ton prompt d'analyse habituel pour générer le texte libre d'un appel. Sauvegarde-le dans un fichier `.txt`.

Exemple : `laetitia-20-janvier-2025.txt`

### Étape 2 : Convertir en variables

```bash
python3 convert-analysis.py laetitia-20-janvier-2025.txt
```

**Output** : `laetitia-20-janvier-2025-variables.txt`

Contient la liste complète de variables au format :
```
NOM_CLIENT = Noah
TYPE_APPEL = R2 — Closing Call
DUREE_APPEL = 26 min
...
```

### Étape 3 : Générer le dashboard

1. Ouvre `salia-filler.html` dans ton navigateur
2. Upload/colle ton template HTML
3. Copie les variables de `*-variables.txt` et colle-les dans le champ "Variables"
4. Clique sur **"⚡ Générer le Dashboard"**
5. Le fichier `salia-feedback-*.html` est téléchargé automatiquement

---

## 📁 Fichiers du projet

| Fichier | Rôle |
|---------|------|
| `convert-analysis.py` | Script Python — Convertit analyse → variables |
| `salia-filler.html` | App web — Injecte variables dans template et génère le dashboard |
| `salia-template.html` | Template du dashboard (à uploader dans le filler) |
| `laetitia-analyse.txt` | Exemple d'analyse complète (test) |
| `laetitia-analyse-variables.txt` | Sortie du script (exemple) |

---

## 💡 Exemple complet

```bash
# Étape 1 : Tu as un fichier d'analyse
cat mon-appel.txt

# Étape 2 : Convertir en variables
python3 convert-analysis.py mon-appel.txt
# → Crée mon-appel-variables.txt

# Étape 3 : Ouvrir le filler et utiliser les variables
open salia-filler.html
# Copie-colle les variables de mon-appel-variables.txt
# Clique "Générer"
# → Télécharge salia-feedback-*.html
```

---

## 🔧 Dépannage

### Erreur : "ANTHROPIC_API_KEY non trouvée"

Assure-toi que ta clé API est configurée :
```bash
echo $ANTHROPIC_API_KEY
# Doit afficher : sk-ant-...
```

Si vide, configure-la :
```bash
export ANTHROPIC_API_KEY='sk-ant-...'
```

### Erreur : "Fichier non trouvé"

Assure-toi que le fichier d'analyse existe :
```bash
ls -la mon-appel.txt
```

Chemin absolu si nécessaire :
```bash
python3 convert-analysis.py /chemin/complet/mon-appel.txt
```

### Le script ne génère rien

Vérifi que ta clé API est valide et qu'elle a des crédits API disponibles.

---

## 📊 Format d'une analyse

Une analyse doit contenir les sections suivantes :

```
SECTION 1 — SCORES
[Scores principaux et sous-critères avec justifications]

SECTION 2 — TIMELINE HORODATÉE
[Moments clés du call avec emojis 🟢/🟡/🔴]

SECTION 3 — PLAN D'ACTION GLOBAL
[3 axes d'amélioration]

SECTION 4 — CONSEILS
[3 conseils pragmatiques]

SECTION 5 — PLAN DE RELANCE
[3 étapes de suivi : J+0, J+3, J+7]
```

Voir `laetitia-analyse.txt` pour un exemple complet.

---

## 🎯 Workflow optimal

1. **Appel** → Enregistrement/Notes
2. **Analyse** (15-20 min) → Utilise ton prompt habituel → Sauvegarde en `.txt`
3. **Conversion** (30 sec) → `python3 convert-analysis.py mon-appel.txt`
4. **Dashboard** (1 min) → Ouvre filler HTML → Colle variables → Télécharge
5. **Partage** → Ton HTML est prêt à être partagé/hébergé

**Temps total** : ~20 minutes pour un call complet

---

## 📝 Notes

- Le script appelle Claude API (**coût minimal** ~$0.01 par analyse)
- Les variables multilignes sont supportées (justifications, descriptions, messages)
- Le script crée un fichier `-variables.txt` automatiquement
- Tu peux relancer le script plusieurs fois sur le même fichier (générera un nouveau fichier)

---

## ❓ Questions ?

Consulte :
- `convert-analysis.py` pour voir le prompt de conversion exact
- `salia-filler.html` pour voir comment les variables sont injectées
- `laetitia-analyse.txt` pour un exemple d'analyse au format attendu
