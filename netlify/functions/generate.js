// netlify/functions/generate.js - Version Gemini (modèle corrigé)
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

        // 🔥 Appel à Gemini (modèle stable)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Rédige un article SEO complet sur le sujet : "${keyword}".

Structure obligatoire :
1. Titre accrocheur (H1)
2. Introduction (150 mots) qui capte l'attention
3. 4 sous-parties (H2) avec des listes, exemples, conseils
4. FAQ avec 3 questions/réponses
5. Conclusion avec appel à l'action

Format : Markdown (sans texte avant ou après)
Longueur : 1500-2000 mots
Ton : professionnel, expert`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Erreur Gemini');
        }

        const articleContent = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                content: articleContent,
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
