// Vercel Serverless Function for MiniMax API

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
  const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || 'https://api.minimax.chat/v1';
  const MINIMAX_MODEL = process.env.MINIMAX_MODEL || 'minimax-m2.7';

  // Check if API key is configured
  if (!MINIMAX_API_KEY) {
    return res.status(500).json({ error: 'MINIMAX_API_KEY not configured on server' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch(`${MINIMAX_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: MINIMAX_MODEL,
        messages: [
          { role: 'user', content: message }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `API error: ${errorText}` });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No response';

    return res.status(200).json({ content });
  } catch (error) {
    console.error('MiniMax API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
