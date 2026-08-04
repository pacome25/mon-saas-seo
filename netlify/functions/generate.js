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

        // 🔥 APPEL À CLAUDE (vrai)
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4000,
                temperature: 0.7,
                messages: [{
                    role: 'user',
                    content: `Rédige un article SEO complet sur le sujet : "${keyword}".

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
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Erreur Claude');
        }

        const articleContent = data.content[0].text;

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
