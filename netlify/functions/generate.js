,
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
                    content: `Rédige un article SEO complet sur le sujet