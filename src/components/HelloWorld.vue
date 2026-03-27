<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      👉👉👉👉👉,<br>
      check out the
      <a href="https://b23.tv/DmyVWD9" target="_blank" rel="noopener">宸墨嵐的哔哩哔哩</a>.
      <a href="http://www.staggeringbeauty.com/" target="_blank" rel="noopener">访问记录</a>.
    </p>

    <!-- MiniMax Chat -->
    <div class="chat-container">
      <div class="chat-box" ref="chatBox">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
          <div class="role-line">
            <span class="role">{{ msg.role }}:</span>
            <span v-if="msg.role === 'MiniMax' && msg.thinkingTime" class="thinking-time">
              思考时间: {{ msg.thinkingTime }}s
            </span>
          </div>

          <!-- Collapsible thinking section -->
          <div v-if="msg.role === 'MiniMax' && msg.thinking" class="thinking-section">
            <button @click="msg.thinkingExpanded = !msg.thinkingExpanded" class="thinking-toggle">
              {{ msg.thinkingExpanded ? '▼ 隐藏思考过程' : '▶ 显示思考过程' }}
            </button>
            <div v-if="msg.thinkingExpanded" class="thinking-content" v-html="formatContent(msg.thinking)"></div>
          </div>

          <div class="content-line">
            <span class="content" v-html="formatContent(msg.content)"></span>
            <span v-if="msg.streaming" class="cursor">▊</span>
          </div>
        </div>
      </div>
      <div class="input-area">
        <input
          v-model="userInput"
          type="text"
          placeholder="输入消息..."
          :disabled="isLoading"
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage" :disabled="isLoading">
          {{ isLoading ? '生成中...' : '发送' }}
        </button>
      </div>
    </div>

    <!-- Google AdSense -->
    <AdSense />

    <!-- 电影资源分享 -->
    <h3>电影资源分享</h3>
    <p><a href="/video.html" target="_blank">打开视频页面 →</a></p>
    <ul>
      <li><a href="https://www.dy2018.com/" target="_blank" rel="noopener">电影天堂</a></li>
      <li><a href="https://www.agedm.org/" target="_blank" rel="noopener">AGE动漫</a></li>
    </ul>

    <!-- 社区资讯 -->
    <h3>社区资讯</h3>
    <ul>
      <li><a href="https://36kr.com/" target="_blank" rel="noopener">36kr</a> - 创业资讯，科技新闻</li>
      <li><a href="https://sspai.com/" target="_blank" rel="noopener">少数派</a> - 高品质数字消费指南</li>
      <li><a href="https://www.youtube.com/" target="_blank" rel="noopener">YouTube</a> - 全球最大的学习分享平台</li>
      <li><a href="https://www.google.com/" target="_blank" rel="noopener">Google</a> - 全球最大的搜索平台</li>
    </ul>

    <!-- 素材资源 -->
    <h3>素材资源</h3>
    <ul>
      <li><a href="https://www.iconfont.cn/" target="_blank" rel="noopener">iconfont</a> - 阿里巴巴矢量图标库</li>
      <li><a href="https://www.flaticon.com/" target="_blank" rel="noopener">flaticon</a> - 634,000+ 免费矢量图标</li>
      <li><a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Font</a> - 优质字体</li>
      <li><a href="https://unsplash.com/" target="_blank" rel="noopener">Unsplash</a> - 免费高清图片</li>
      <li><a href="https://pixabay.com/" target="_blank" rel="noopener">pixabay</a> - 免费图片和视频</li>
    </ul>

    <!-- 常用推荐 -->
    <h3>常用推荐</h3>
    <ul>
      <li><a href="https://www.ui.cn/" target="_blank" rel="noopener">UI中国</a> - 图形交互与界面设计交流</li>
      <li><a href="https://www.zcool.com.cn/" target="_blank" rel="noopener">站酷</a> - 中国人气设计师互动平台</li>
      <li><a href="https://www.producthunt.com/" target="_blank" rel="noopener">Product Hunt</a> - 发现新鲜有趣的产品</li>
      <li><a href="https://www.behance.net/" target="_blank" rel="noopener">Behance</a> - Adobe旗下的设计师交流平台</li>
    </ul>
  </div>
</template>

<script>
import AdSense from './AdSense.vue';

export default {
  name: 'HelloWorld',
  components: {
    AdSense
  },
  props: {
    msg: String,
  },
  data() {
    return {
      userInput: '',
      messages: [],
      isLoading: false,
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;

      const userMessage = this.userInput.trim();
      this.userInput = '';
      this.isLoading = true;

      this.messages.push({
        role: 'You',
        content: userMessage,
        type: 'user'
      });

      const assistantMsg = {
        role: 'MiniMax',
        content: '',
        type: 'assistant',
        streaming: true,
        thinking: '',
        thinkingTime: 0,
        thinkingExpanded: false
      };
      this.messages.push(assistantMsg);

      const startTime = Date.now();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            stream: true
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `请求失败 (${response.status})`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let reading = true;

        while (reading) {
          const { value, done } = await reader.read();
          if (done) {
            reading = false;
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // 用正则提取所有 data: {...} 块，兼容无换行符拼接的情况
          const regex = /data:\s*(\{.*?\})(?=data:|\s*$)/gs;
          let match;
          let lastIndex = 0;

          while ((match = regex.exec(buffer)) !== null) {
            const jsonStr = match[1].trim();
            if (jsonStr && jsonStr !== '[DONE]') {
              this.processStreamData(jsonStr, assistantMsg);
            }
            lastIndex = regex.lastIndex;
          }

          // 保留未匹配完的尾部继续下一轮拼接
          buffer = buffer.slice(lastIndex);

          assistantMsg.thinkingTime = ((Date.now() - startTime) / 1000).toFixed(2);

          this.$nextTick(() => {
            if (this.$refs.chatBox) {
              this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
            }
          });
        }
      } catch (err) {
        console.error('Chat error:', err);
        assistantMsg.content = `抱歉，出现错误: ${err.message}`;
      } finally {
        assistantMsg.streaming = false;
        assistantMsg.thinkingTime = ((Date.now() - startTime) / 1000).toFixed(2);
        this.isLoading = false;
      }
    },

    processStreamData(data, msgObj) {
      try {
        const parsed = JSON.parse(data);

        if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.thinking) {
          msgObj.thinking += parsed.choices[0].delta.thinking;
        } else if (parsed.thinking) {
          msgObj.thinking += parsed.thinking;
        }

        if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
          msgObj.content += parsed.choices[0].delta.content;
        } else if (parsed.choices && parsed.choices[0] && parsed.choices[0].text) {
          msgObj.content += parsed.choices[0].text;
        } else if (parsed.delta && parsed.delta.content) {
          msgObj.content += parsed.delta.content;
        } else if (parsed.content) {
          msgObj.content += parsed.content;
        } else if (parsed.text) {
          msgObj.content += parsed.text;
        }
      } catch (e) {
        if (data && data.length > 0) {
          msgObj.content += data;
        }
      }
    },

    formatContent(content) {
      if (!content) return '';
      return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    }
  },
};
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #42b983;
}

h3 {
  margin: 30px 0 15px;
  color: #00ffe7;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

li {
  margin: 5px;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.chat-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.chat-box {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
  text-align: left;
  border-radius: 4px;
}

.message {
  margin: 12px 0;
  padding: 10px;
  border-radius: 8px;
  line-height: 1.6;
}

.message.user {
  background: #e3f2fd;
  text-align: right;
}

.message.assistant {
  background: #f5f5f5;
}

.role-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.role {
  font-weight: bold;
  color: #666;
}

.message.user .role {
  color: #1976d2;
}

.message.assistant .role {
  color: #388e3c;
}

.thinking-time {
  font-size: 12px;
  color: #888;
  font-style: italic;
}

.thinking-section {
  margin: 8px 0;
}

.thinking-toggle {
  background: none;
  border: none;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  text-decoration: underline;
}

.thinking-toggle:hover {
  color: #333;
}

.thinking-content {
  background: #fff9e6;
  border-left: 3px solid #ffcc00;
  padding: 8px 12px;
  margin-top: 6px;
  font-size: 13px;
  color: #555;
  border-radius: 0 4px 4px 0;
  max-height: 200px;
  overflow-y: auto;
}

.content-line {
  display: inline;
}

.message .content {
  color: #000;
  word-break: break-word;
}

.message.user .content {
  color: #000;
}

.message .cursor {
  display: inline-block;
  animation: blink 0.7s infinite;
  color: #42b983;
  font-weight: bold;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:disabled {
  background: #f5f5f5;
}

button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background: #359268;
}

button:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

code {
  background: #eee;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}
</style>
