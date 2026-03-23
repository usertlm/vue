// MiniMax API 代理调用
// 使用 Vercel Serverless Function 代理，保护 API Key 安全

const API_URL = '/api/chat';

export async function chatWithMiniMax(userMessage) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `请求失败 (${response.status})`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('MiniMax API 错误:', error);
    return `抱歉，出现错误: ${error.message}`;
  }
}
