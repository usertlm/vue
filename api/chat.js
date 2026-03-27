// Vercel Serverless Function for MiniMax API - Streaming support

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

  const { message, stream = true } = req.body;

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
        stream: stream
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `API error: ${errorText}` });
    }

    if (stream) {
      // Set headers for streaming response (SSE)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      
      // Stream the response directly, format as SSE
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (buffer.trim()) {
              res.write(`data: ${buffer.trim()}\n\n`);
            }
            res.write('data: [DONE]\n\n');
            break;
          }
          
          if (value) {
            buffer += decoder.decode(value, { stream: true });
            
            // Process complete SSE messages in buffer
            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
              const line = buffer.slice(0, newlineIndex).trim();
              buffer = buffer.slice(newlineIndex + 1);
              
              if (line) {
                // Format as SSE data event
                res.write(`data: ${line}\n\n`);
              }
            }
          }
        }
        res.end();
      } catch (streamError) {
        console.error('Stream error:', streamError);
        res.end();
      }
    } else {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No response';
      return res.status(200).json({ content });
    }
  } catch (error) {
    console.error('MiniMax API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
