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
          <span class="role">{{ msg.role }}:</span>
          <span class="content" v-html="formatContent(msg.content)"></span>
          <span v-if="msg.streaming" class="cursor">▊</span>
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

      // Add user message
      this.messages.push({
        role: 'You',
        content: userMessage,
        type: 'user'
      });

      // Add assistant message placeholder
      const assistantMsg = {
        role: 'MiniMax',
        content: '',
        type: 'assistant',
        streaming: true
      };
      this.messages.push(assistantMsg);

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

        // Handle SSE streaming
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          // Process complete SSE messages
          let lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer
          
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === '[DONE]') continue;
            
            // Parse SSE format: "data: {...}"
            if (trimmed.startsWith('data:')) {
              const data = trimmed.slice(5).trim();
              if (data && data !== '[DONE]') {
                this.processStreamData(data, assistantMsg);
              }
            } else {
              // Try parsing raw data
              this.processStreamData(data || trimmed, assistantMsg);
            }
          }
          
          // Scroll to bottom
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
        this.isLoading = false;
      }
    },
    
    processStreamData(data, msgObj) {
      try {
        // Try JSON parsing (OpenAI/MiniMax SSE format)
        const parsed = JSON.parse(data);
        
        // Handle different API response formats
        if (parsed.choices && parsed.choices[0]?.delta?.content) {
          msgObj.content += parsed.choices[0].delta.content;
        } else if (parsed.choices && parsed.choices[0]?.text) {
          msgObj.content += parsed.choices[0].text;
        } else if (parsed.delta?.content) {
          msgObj.content += parsed.delta.content;
        } else if (parsed.content) {
          msgObj.content += parsed.content;
        } else if (parsed.text) {
          msgObj.content += parsed.text;
        }
      } catch (e) {
        // If not JSON, treat as raw text delta
        if (data && data.length > 0) {
          msgObj.content += data;
        }
      }
    },
    
    formatContent(content) {
      // Simple formatting for the content
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
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
  text-align: left;
  border-radius: 4px;
}

.message {
  margin: 10px 0;
  padding: 8px 12px;
  border-radius: 8px;
  line-height: 1.5;
}

.message.user {
  background: #e3f2fd;
  text-align: right;
}

.message.assistant {
  background: #f5f5f5;
}

.message .role {
  font-weight: bold;
  margin-right: 8px;
  color: #666;
}

.message.user .role {
  color: #1976d2;
}

.message.assistant .role {
  color: #388e3c;
}

.message .content {
  word-break: break-word;
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
