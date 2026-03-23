// MiniMax API 交互模块
// 环境变量（在 Vercel 后台设置）：
// - VITE_MINIMAX_API_KEY: 你的 MiniMax API 密钥
// - VITE_MINIMAX_BASE_URL: https://api.minimax.chat/v1 (可选，有默认值)
// - VITE_MINIMAX_MODEL: minimax-m2.7 (可选)

const API_KEY = import.meta.env.VITE_MINIMAX_API_KEY;
const BASE_URL = import.meta.env.VITE_MINIMAX_BASE_URL || 'https://api.minimax.chat/v1';
const MODEL = import.meta.env.VITE_MINIMAX_MODEL || 'minimax-m2.7';

export async function chatWithMiniMax(userMessage) {
  if (!API_KEY) {
    return '请在 Vercel 环境变量中配置 VITE_MINIMAX_API_KEY';
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'user', content: userMessage }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('MiniMax API 错误:', error);
    return `抱歉，出现错误: ${error.message}`;
  }
}
