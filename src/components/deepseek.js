// DeepSeek API 交互模块
// 请在此处配置你的 DeepSeek API Key
const DEEPSEEK_API_KEY = 'your-api-key-here';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function chatWithDeepSeek(userMessage) {
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your-api-key-here') {
    return '请配置 DeepSeek API Key';
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API 错误:', error);
    return `抱歉，出现错误: ${error.message}`;
  }
}
