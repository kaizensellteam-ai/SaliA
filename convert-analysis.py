#!/usr/bin/env python3
"""
SaliA — Convertisseur Analyse → Variables (Étape 2)
Prend un fichier d'analyse texte libre en entrée
Retourne une liste de variables formatées
"""

import sys
import os
import json
from pathlib import Path
from anthropic import Anthropic

# ── Prompt de conversion (Étape 2) ──────────────────────────────────────────
CONVERSION_PROMPT = """Tu es un convertisseur d'analyses de calls en variables HTML.
Tu reçois une analyse structurée d'un call de vente au format riche (sections, scores, justifications, timeline, conseils, relances).

Ta tâche : extraire TOUTES les données et les retourner UNIQUEMENT sous forme de liste de variables au format exact NOM_VARIABLE = valeur, sans rien d'autre (pas d'explication, pas de markdown, pas de commentaire).

RÈGLES DE CALCUL :

1. POURCENTAGES (PCT_*) :
   - PCT_OBJ = (SCORE_OBJ / 25) × 100
   - PCT_PRES = (SCORE_PRES / 15) × 100
   - PCT_CAD = (SCORE_CAD / 15) × 100
   - PCT_TRAME = (SCORE_TRAME / 15) × 100
   - PCT_FIN = (SCORE_FIN / 15) × 100
   - PCT_POST = (SCORE_POST / 8) × 100
   - PCT_RATIO = (SCORE_RATIO / 7) × 100

2. CLASSES DE SCORE (CLASSE_* pour chaque score) :
   - score-good si pourcentage ≥ 70%
   - score-mid si pourcentage entre 40% et 70%
   - score-bad si pourcentage < 40%

3. CLASSE_RESULTAT (selon le résultat du call) :
   - result-close si deal fermé (R2 → achat)
   - result-r3 si R3 planifiée
   - result-lost si prospect perdu

4. CLASSE DE TIMELINE (CLASSE_M*) selon l'emoji :
   - m-green pour 🟢
   - m-yellow pour 🟡
   - m-red pour 🔴

5. CLASSE DE RELANCES (CLASSE_R*) selon le canal :
   - r-call pour Appel
   - r-mail pour Mail
   - r-sms pour SMS

VARIABLES À EXTRAIRE (dans cet ordre exact) :

--- INFORMATIONS GÉNÉRALES ---
NOM_CLIENT = [nom de la personne qui vend]
TYPE_APPEL = [ex: R2 — Closing Call]
DUREE_APPEL = [durée en minutes]
NOM_PROSPECT = [nom de l'entreprise/personne du prospect]
CONTEXTE_PROSPECT = [description de l'entreprise/situation]
DATE_CALL = [date du call]
NOTE_GLOBALE = [score total sur 100]
CLASSE_RESULTAT = [result-close / result-r3 / result-lost]
RESULTAT_APPEL = [description du résultat avec emoji]
RATIO_PAROLE = [pourcentage arrondi]

--- SCORES PRINCIPAUX ---
SCORE_OBJ = [valeur]
CLASSE_OBJ = [score-good/mid/bad calculé]
PCT_OBJ = [pourcentage calculé arrondi à l'entier]
SCORE_PRES = [valeur]
CLASSE_PRES = [score-good/mid/bad calculé]
PCT_PRES = [pourcentage calculé arrondi à l'entier]
SCORE_CAD = [valeur]
CLASSE_CAD = [score-good/mid/bad calculé]
PCT_CAD = [pourcentage calculé arrondi à l'entier]
SCORE_TRAME = [valeur]
CLASSE_TRAME = [score-good/mid/bad calculé]
PCT_TRAME = [pourcentage calculé arrondi à l'entier]
SCORE_FIN = [valeur]
CLASSE_FIN = [score-good/mid/bad calculé]
PCT_FIN = [pourcentage calculé arrondi à l'entier]
SCORE_POST = [valeur]
CLASSE_POST = [score-good/mid/bad calculé]
PCT_POST = [pourcentage calculé arrondi à l'entier]
SCORE_RATIO = [valeur]
CLASSE_RATIO = [score-good/mid/bad calculé]
PCT_RATIO = [pourcentage calculé arrondi à l'entier]

--- SOUS-CRITÈRES OBJECTIONS ---
SCORE_OBJ_1 = [valeur]
CLASSE_OBJ_1 = [score-good/mid/bad calculé]
JUSTIF_OBJ_1 = [texte de justification]
SCORE_OBJ_2 = [valeur]
CLASSE_OBJ_2 = [score-good/mid/bad calculé]
JUSTIF_OBJ_2 = [texte de justification]
SCORE_OBJ_3 = [valeur]
CLASSE_OBJ_3 = [score-good/mid/bad calculé]
JUSTIF_OBJ_3 = [texte de justification]
SCORE_OBJ_4 = [valeur]
CLASSE_OBJ_4 = [score-good/mid/bad calculé]
JUSTIF_OBJ_4 = [texte de justification]

--- SOUS-CRITÈRES PRÉSENTATION ---
SCORE_PRES_1 = [valeur]
CLASSE_PRES_1 = [score-good/mid/bad calculé]
JUSTIF_PRES_1 = [texte]
SCORE_PRES_2 = [valeur]
CLASSE_PRES_2 = [score-good/mid/bad calculé]
JUSTIF_PRES_2 = [texte]
SCORE_PRES_3 = [valeur]
CLASSE_PRES_3 = [score-good/mid/bad calculé]
JUSTIF_PRES_3 = [texte]
SCORE_PRES_4 = [valeur]
CLASSE_PRES_4 = [score-good/mid/bad calculé]
JUSTIF_PRES_4 = [texte]
SCORE_PRES_5 = [valeur]
CLASSE_PRES_5 = [score-good/mid/bad calculé]
JUSTIF_PRES_5 = [texte]

--- SOUS-CRITÈRES CADRAGE ---
SCORE_CAD_1 = [valeur]
CLASSE_CAD_1 = [score-good/mid/bad calculé]
JUSTIF_CAD_1 = [texte]
SCORE_CAD_2 = [valeur]
CLASSE_CAD_2 = [score-good/mid/bad calculé]
JUSTIF_CAD_2 = [texte]
SCORE_CAD_3 = [valeur]
CLASSE_CAD_3 = [score-good/mid/bad calculé]
JUSTIF_CAD_3 = [texte]
SCORE_CAD_4 = [valeur]
CLASSE_CAD_4 = [score-good/mid/bad calculé]
JUSTIF_CAD_4 = [texte]
SCORE_CAD_5 = [valeur]
CLASSE_CAD_5 = [score-good/mid/bad calculé]
JUSTIF_CAD_5 = [texte]

--- SOUS-CRITÈRES TRAME ---
SCORE_TRAME_1 = [valeur]
CLASSE_TRAME_1 = [score-good/mid/bad calculé]
JUSTIF_TRAME_1 = [texte]
SCORE_TRAME_2 = [valeur]
CLASSE_TRAME_2 = [score-good/mid/bad calculé]
JUSTIF_TRAME_2 = [texte]
SCORE_TRAME_3 = [valeur]
CLASSE_TRAME_3 = [score-good/mid/bad calculé]
JUSTIF_TRAME_3 = [texte]
SCORE_TRAME_4 = [valeur]
CLASSE_TRAME_4 = [score-good/mid/bad calculé]
JUSTIF_TRAME_4 = [texte]
SCORE_TRAME_5 = [valeur]
CLASSE_TRAME_5 = [score-good/mid/bad calculé]
JUSTIF_TRAME_5 = [texte]
SCORE_TRAME_6 = [valeur]
CLASSE_TRAME_6 = [score-good/mid/bad calculé]
JUSTIF_TRAME_6 = [texte]
SCORE_TRAME_7 = [valeur]
CLASSE_TRAME_7 = [score-good/mid/bad calculé]
JUSTIF_TRAME_7 = [texte]

--- SOUS-CRITÈRES FIN D'APPEL ---
SCORE_FIN_1 = [valeur]
CLASSE_FIN_1 = [score-good/mid/bad calculé]
JUSTIF_FIN_1 = [texte]
SCORE_FIN_2 = [valeur]
CLASSE_FIN_2 = [score-good/mid/bad calculé]
JUSTIF_FIN_2 = [texte]
SCORE_FIN_3 = [valeur]
CLASSE_FIN_3 = [score-good/mid/bad calculé]
JUSTIF_FIN_3 = [texte]

--- SOUS-CRITÈRES POSTURE ---
SCORE_POST_1 = [valeur]
CLASSE_POST_1 = [score-good/mid/bad calculé]
JUSTIF_POST_1 = [texte]
SCORE_POST_2 = [valeur]
CLASSE_POST_2 = [score-good/mid/bad calculé]
JUSTIF_POST_2 = [texte]
SCORE_POST_3 = [valeur]
CLASSE_POST_3 = [score-good/mid/bad calculé]
JUSTIF_POST_3 = [texte]
SCORE_POST_4 = [valeur]
CLASSE_POST_4 = [score-good/mid/bad calculé]
JUSTIF_POST_4 = [texte]

JUSTIF_RATIO = [texte de justification]

--- TIMELINE HORODATÉE ---
TS_M1 = [timestamp ex: 0:34]
CLASSE_M1 = [m-green / m-yellow / m-red]
EMOJI_M1 = [emoji exact : 🟢 / 🟡 / 🔴]
TITRE_M1 = [titre court du moment]
DESC_M1 = [description détaillée]
[... répète pour M2 à M8 ...]

--- PLAN D'ACTION ---
TITRE_AXE_1 = [titre de l'axe]
DESC_AXE_1 = [description]
TITRE_AXE_2 = [titre]
DESC_AXE_2 = [description]
TITRE_AXE_3 = [titre]
DESC_AXE_3 = [description]

--- CONSEILS ---
TITRE_CONSEIL_1 = [titre]
DESC_CONSEIL_1 = [description]
TITRE_CONSEIL_2 = [titre]
DESC_CONSEIL_2 = [description]
TITRE_CONSEIL_3 = [titre]
DESC_CONSEIL_3 = [description]

--- RELANCES ---
CANAL_R1 = [Appel / Mail / SMS]
CLASSE_R1 = [r-call / r-mail / r-sms]
TIMING_R1 = [timing ex: J+1]
SUJET_R1 = [sujet/objet]
MESSAGE_R1 = [contenu exact]
CANAL_R2 = [Appel / Mail / SMS]
CLASSE_R2 = [r-call / r-mail / r-sms]
TIMING_R2 = [timing]
SUJET_R2 = [sujet]
MESSAGE_R2 = [contenu]
CANAL_R3 = [Appel / Mail / SMS]
CLASSE_R3 = [r-call / r-mail / r-sms]
TIMING_R3 = [timing]
SUJET_R3 = [sujet]
MESSAGE_R3 = [contenu]

IMPORTANT :
- Retourne UNIQUEMENT les variables, une par ligne, dans l'ordre exact ci-dessus
- Aucune explication, aucun markdown, aucun commentaire
- Arrondir les pourcentages à l'entier le plus proche
- Préserver exactement le texte des justifications et descriptions (sans guillemets, sans échappement)
- Si une valeur s'étend sur plusieurs lignes, continuer la même variable sur les lignes suivantes jusqu'à la prochaine qui commence par NOM_VARIABLE =
- Pas de guillemets autour des valeurs
"""


def load_api_key():
    """Charge la clé API depuis .env ou la variable d'environnement."""
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        raise ValueError(
            "⚠️  ANTHROPIC_API_KEY non trouvée.\n"
            "Configure ta clé API :\n"
            "  export ANTHROPIC_API_KEY='sk-ant-...'\n"
            "Ou crée un fichier .env à la racine du projet."
        )
    return api_key


def convert_analysis(analysis_text: str) -> str:
    """Convertit une analyse texte en liste de variables."""
    api_key = load_api_key()
    client = Anthropic(api_key=api_key)

    print("🔄 Conversion en cours (appel à Claude API)...")

    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=8000,
        messages=[
            {
                "role": "user",
                "content": f"{CONVERSION_PROMPT}\n\n---\n\nVoici mon analyse :\n\n{analysis_text}",
            }
        ],
    )

    variables = message.content[0].text
    return variables


def main():
    """Point d'entrée du script."""
    if len(sys.argv) < 2:
        print("📖 Usage: python convert-analysis.py <fichier-analyse.txt>")
        print("Exemple: python convert-analysis.py laetitia-20-janvier-2025.txt")
        sys.exit(1)

    input_file = sys.argv[1]
    input_path = Path(input_file)

    if not input_path.exists():
        print(f"❌ Fichier non trouvé : {input_file}")
        sys.exit(1)

    print(f"📖 Lecture du fichier : {input_file}")
    analysis_text = input_path.read_text(encoding="utf-8")

    print(f"   → {len(analysis_text)} caractères")

    variables = convert_analysis(analysis_text)

    output_file = input_path.stem + "-variables.txt"
    output_path = Path(output_file)

    output_path.write_text(variables, encoding="utf-8")

    print(f"✅ Variables générées : {output_file}")
    print(f"\n--- Aperçu (premières lignes) ---")
    print("\n".join(variables.split("\n")[:20]))
    print("\n... (voir le fichier complet)")


if __name__ == "__main__":
    main()
