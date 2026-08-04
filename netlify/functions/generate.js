// netlify/functions/generate.js
exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
        const { keyword } = JSON.parse(event.body);

        if (!keyword) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Mot-clé manquant' }),
            };
        }

        // 🔥 ICI ON APPELLE CLAUDE (pour l'instant, article simulé)
        // Dès que tu auras ta clé API Claude, on remplacera par le vrai appel
        const fakeArticle = `# Article sur "${keyword}"

## Introduction
Ceci est un article généré automatiquement pour le mot-clé : **${keyword}**.

## Partie 1 : Pourquoi c'est important
Le sujet "${keyword}" est crucial en 2026...

## Partie 2 : Comment faire
Voici 3 étapes clés pour réussir...

## Conclusion
En résumé, "${keyword}" est un levier de croissance puissant.

---
*Article généré par SEO Autopilot (version demo)*`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                content: fakeArticle,
                keyword: keyword,
            }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
