<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3 class="chat-title">💬 AI 聊天</h3>
    </div>

    <div class="chat-box" ref="chatBox">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.type]"
      >
        <div class="role-line">
          <span class="role">{{ msg.role === 'You' ? '你' : 'AI' }}</span>
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
          <span class="content" v-html="msg.content"></span>
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
        const responseContent = data.content || '';
        const parsed = this.extractThinkFromContent(responseContent);
        assistantMsg.thinking = data.thinking || parsed.thinking || '';

        if (data.debug) {
          assistantMsg.content = this.formatContent('Raw: ' + JSON.stringify(data.raw, null, 2));
        } else {
          await this.typeoutEffect(assistantMsg, parsed.content);
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
      const chars = Array.from(text);
      let currentText = '';
      for (let i = 0; i < chars.length; i++) {
        currentText += chars[i];
        msg.content = this.formatContent(currentText);
        await new Promise(resolve => setTimeout(resolve, speed));
        if (i % 3 === 0) {
          this.scrollToBottom();
        }
      }
    },

    extractThinkFromContent(content) {
      if (!content) return { thinking: '', content: '' };
      const thinkingParts = [];
      const cleanedContent = content
        .replace(/<think>([\s\S]*?)<\/think>/gi, (_, thinkText) => {
          const trimmed = (thinkText || '').trim();
          if (trimmed) thinkingParts.push(trimmed);
          return '';
        })
        .replace(/<\/?think>/gi, '')
        .trim();

      return {
        thinking: thinkingParts.join('\n\n'),
        content: cleanedContent
      };
    },

    escapeHtml(content) {
      return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    formatContent(content) {
      if (!content) return '';
      const safeContent = this.escapeHtml(content);
      return safeContent
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
  max-width: 700px;
  margin: 32px auto;
  background: #faf9f5;
  border: 1px solid #f0eee6;
  border-radius: 16px;
  box-shadow: rgba(0,0,0,0.05) 0px 4px 24px;
  overflow: hidden;
}

.chat-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0eee6;
}

.chat-title {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: 500;
  color: #141413;
  margin: 0;
}

.chat-box {
  height: 400px;
  overflow-y: auto;
  padding: 16px 20px;
  background: #faf9f5;
}

.message {
  margin: 14px 0;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.60;
}

.message.user {
  background: #e8e6dc;
  text-align: right;
  border-bottom-right-radius: 4px;
}

.message.assistant {
  background: #ffffff;
  text-align: left;
  border-bottom-left-radius: 4px;
  box-shadow: 0px 0px 0px 1px #f0eee6;
}

.role-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.role {
  font-weight: 600;
  font-size: 13px;
  color: #5e5d59;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.message.user .role { color: #c96442; }
.message.assistant .role { color: #4d4c48; }

.thinking-time {
  font-size: 12px;
  color: #87867f;
  font-style: italic;
}

.thinking-section { margin: 8px 0; }

.thinking-toggle {
  background: #e8e6dc;
  border: none;
  color: #5e5d59;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  transition: background 0.2s;
}

.thinking-toggle:hover { background: #d1cfc5; }

.thinking-content {
  background: #faf9f5;
  border-left: 3px solid #c96442;
  padding: 8px 12px;
  margin: 4px 0;
  font-size: 13px;
  color: #5e5d59;
  border-radius: 0 6px 6px 0;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Courier New', monospace;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 200px; }
}

.content-line { display: inline; }

.message .content {
  color: #141413;
  word-break: break-word;
  font-size: 15px;
}

.message .cursor {
  display: inline-block;
  animation: blink 0.7s infinite;
  color: #c96442;
  font-weight: bold;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.input-area {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #f0eee6;
  background: #faf9f5;
}

.input-area input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid #f0eee6;
  border-radius: 10px;
  font-size: 15px;
  background: #ffffff;
  color: #141413;
  font-family: Arial, sans-serif;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-area input:focus {
  outline: none;
  border-color: #c96442;
  box-shadow: 0 0 0 3px rgba(201, 100, 66, 0.10);
}

.input-area input:disabled { background: #f5f4ed; color: #87867f; }

.input-area button {
  padding: 11px 22px;
  background: #c96442;
  color: #faf9f5;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  font-family: Arial, sans-serif;
}

.input-area button:hover:not(:disabled) { background: #d97757; }
.input-area button:disabled { background: #d1cfc5; cursor: not-allowed; }

code {
  background: #e8e6dc;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #c96442;
}

strong { font-weight: 600; color: #141413; }
em { font-style: italic; color: #5e5d59; }
</style>
