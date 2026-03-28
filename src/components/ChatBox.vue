<template>
  <div class="chat-container">
    <div class="chat-box" ref="chatBox">
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
        <div class="role-line">
          <span class="role">{{ msg.role }}:</span>
          <span v-if="msg.role === 'AI' && msg.thinkingTime" class="thinking-time">
            思考 {{ msg.thinkingTime }}s
          </span>
        </div>

        <!-- Collapsible thinking section -->
        <div v-if="msg.role === 'AI' && msg.thinking" class="thinking-section">
          <button @click="msg.thinkingExpanded = !msg.thinkingExpanded" class="thinking-toggle">
            {{ msg.thinkingExpanded ? '▼' : '▶' }} 思考过程
          </button>
          <div v-if="msg.thinkingExpanded" class="thinking-content">
            {{ msg.thinking }}
          </div>
        </div>

        <div class="content-line">
          <span class="content">{{ msg.content }}</span>
          <span v-if="msg.loading" class="cursor">▊</span>
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
        {{ isLoading ? '思考中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatBox',
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
        content: this.formatContent(userMessage),
        type: 'user'
      });

      const assistantMsg = {
        role: 'AI',
        content: '',
        type: 'assistant',
        loading: true,
        thinking: '',
        thinkingExpanded: false,
        thinkingTime: 0
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
            message: userMessage
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `请求失败 (${response.status})`);
        }

        const data = await response.json();

        assistantMsg.thinking = data.thinking || '';
        const responseContent = data.content || '';

        // Show debug info if no content
        if (data.debug) {
          assistantMsg.content = this.formatContent('Raw: ' + JSON.stringify(data.raw, null, 2));
        } else {
          // 流式显示效果 - 逐字显示
          await this.typeoutEffect(assistantMsg, responseContent);
        }

      } catch (err) {
        console.error('Chat error:', err);
        assistantMsg.content = this.formatContent(`抱歉，出现错误: ${err.message}`);
      } finally {
        assistantMsg.loading = false;
        assistantMsg.thinkingTime = ((Date.now() - startTime) / 1000).toFixed(1);
        this.isLoading = false;

        this.scrollToBottom();
      }
    },

    async typeoutEffect(msg, text, speed = 10) {
      // 速度越小显示越快 (毫秒)
      // 使用按字符（Unicode 码点）遍历，避免拆分表情符号等多字节字符
      const chars = Array.from(text);
      let currentText = '';
      for (let i = 0; i < chars.length; i++) {
        currentText += chars[i];
        msg.content = this.formatContent(currentText);

        await new Promise(resolve => setTimeout(resolve, speed));

        // 每显示3个字符滚动一次
        if (i % 3 === 0) {
          this.scrollToBottom();
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
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatBox) {
          this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
        }
      });
    }
  }
};
</script>

<style scoped>
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
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 12px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.thinking-toggle:hover {
  background: #e0e0e0;
}

.thinking-content {
  background: #fff9e6;
  border-left: 3px solid #ffcc00;
  padding: 8px 12px;
  margin: 4px 0;
  font-size: 13px;
  color: #555;
  border-radius: 0 4px 4px 0;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Courier New', monospace;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 200px;
  }
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
  transition: background 0.2s ease;
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

strong {
  font-weight: bold;
  color: #333;
}

em {
  font-style: italic;
  color: #555;
}
</style>
