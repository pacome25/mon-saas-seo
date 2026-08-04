// netlify/functions/connect.js
exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
        const { siteName, siteUrl } = JSON.parse(event.body);

        if (!siteName || !siteUrl) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Champs obligatoires manquants' }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `✅ Site "${siteName}" connecté avec succès !`,
                siteId: Date.now().toString()
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
