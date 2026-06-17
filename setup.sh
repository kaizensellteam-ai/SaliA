#!/bin/bash
# SaliA — Setup Script
# Configure l'environnement pour utiliser le workflow SaliA

set -e

echo "🚀 SaliA — Setup"
echo "================="

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé"
    exit 1
fi
echo "✅ Python 3 trouvé : $(python3 --version)"

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances..."
python3 -m pip install anthropic --quiet
echo "✅ Anthropic SDK installé"

# Configurer la clé API
echo ""
echo "🔑 Configuration de l'API"
echo "========================="

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo ""
    echo "⚠️  ANTHROPIC_API_KEY n'est pas configurée"
    echo ""
    echo "Deux options :"
    echo ""
    echo "Option 1 : Ajouter à ~/.zshrc ou ~/.bashrc"
    echo "  export ANTHROPIC_API_KEY='sk-ant-...'"
    echo ""
    echo "Option 2 : Créer un fichier .env"
    echo "  echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env"
    echo ""
    read -p "Veux-tu configurer maintenant ? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Colle ta clé API (sk-ant-...) : " api_key
        echo "export ANTHROPIC_API_KEY='$api_key'" >> ~/.zshrc
        echo "✅ Clé ajoutée à ~/.zshrc"
        echo ""
        echo "Source ton shell pour activer :"
        echo "  source ~/.zshrc"
        echo ""
        export ANTHROPIC_API_KEY="$api_key"
    fi
else
    echo "✅ ANTHROPIC_API_KEY configurée"
fi

# Test rapide
echo ""
echo "🧪 Test du setup..."

test_file="$(mktemp /tmp/salia-test-XXXXXX.txt)"
cat > "$test_file" << 'EOF'
SECTION 1 — SCORES

[TEST] : 5 / 10
Justification : Ceci est un test simple pour vérifier que le script fonctionne.

Sous-critères :
Test 1 — 2/3 — Fonctionne correctement
Test 2 — 3/3 — Excellent

SCORE TOTAL : 5 / 10

SECTION 2 — TIMELINE HORODATÉE

0:00 — 🟢 — Début du call
Description : Test simple

SECTION 3 — PLAN D'ACTION GLOBAL

Axe 1 : Tester
Problème : C'est un test
Comment : Utiliser le script

SECTION 4 — CONSEILS

Conseil 1 : Suivre le README
Description : C'est important

SECTION 5 — PLAN DE RELANCE

Relance 1 — EMAIL — J+1
Objet : Test
Message : Ceci est un test
EOF

if python3 convert-analysis.py "$test_file" 2>/dev/null | grep -q "NOM_CLIENT"; then
    echo "✅ Script fonctionne correctement"
else
    echo "❌ Le script a un problème"
    echo "   Vérifie que ANTHROPIC_API_KEY est configurée"
fi

rm -f "$test_file"
rm -f "$(basename "$test_file" .txt)-variables.txt" 2>/dev/null || true

echo ""
echo "✅ Setup terminé !"
echo ""
echo "Prochaines étapes :"
echo "  1. Génère une analyse avec ton prompt habituel"
echo "  2. Sauvegarde-la en .txt"
echo "  3. Lance : python3 convert-analysis.py mon-analyse.txt"
echo "  4. Ouvre salia-filler.html et utilise les variables générées"
echo ""
echo "Voir README.md pour plus de détails"
