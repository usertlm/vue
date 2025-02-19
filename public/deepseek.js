const API_KEY = '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'; // 替换为你的 DeepSeek API Key
const API_URL = 'https://api.deepseek.com/v1/chat/completions'; // 替换为实际的 API URL

async function chatWithDeepSeek(message) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message },
        ],
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content; // 返回 DeepSeek 的回复内容
  } catch (error) {
    console.error('Error:', error);
    return '发生错误，请稍后再试。';
  }
}