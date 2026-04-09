<template>
  <div v-if="!isVerified" class="bot-verification-overlay">
    <div class="verification-modal">
      <!-- 装饰背景 -->
      <div class="modal-bg"></div>

      <!-- 内容 -->
      <div class="modal-content">
        <!-- 验证图标 -->
        <div class="verification-icon">🤖</div>

        <!-- 标题 -->
        <h2 class="modal-title">安全验证</h2>
        <p class="modal-desc">请完成人类验证以访问 AI 对话功能</p>

        <!-- Turnstile 小部件 -->
        <div class="turnstile-wrapper">
          <div :id="turnstileId" class="cf-turnstile"></div>
        </div>

        <!-- 验证按钮 -->
        <button
          @click="handleVerify"
          :disabled="!captchaToken || isLoading"
          class="verify-btn"
          :class="{ loading: isLoading }"
        >
          <span v-if="!isLoading">✓ 验证完成</span>
          <span v-else class="btn-spinner">⟳</span>
        </button>

        <!-- 提示文案 -->
        <p class="modal-hint">🔒 您的隐私受到保护 · 仅此一次</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BotVerificationModal',
  data() {
    return {
      isVerified: false,
      captchaToken: null,
      isLoading: false,
      turnstileId: 'turnstile-' + Math.random().toString(36).substr(2, 9),
      siteKey: process.env.VUE_APP_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
      apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:5000'
    };
  },
  watch: {
    isVerified(newVal) {
      this.$emit('verified', newVal);
    }
  },
  mounted() {
    this.checkExistingVerification();
    this.initTurnstile();
  },
  methods: {
    checkExistingVerification() {
      const verified = localStorage.getItem('bot-verified');
      const timestamp = localStorage.getItem('bot-verified-timestamp');

      // 验证24小时有效
      if (verified && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < 24 * 60 * 60 * 1000) {
          this.isVerified = true;
          return;
        }
      }

      this.isVerified = false;
    },

    initTurnstile() {
      // 加载 Turnstile 脚本
      if (window.turnstile) {
        this.renderTurnstile();
      } else {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.onload = () => this.renderTurnstile();
        document.head.appendChild(script);
      }
    },

    renderTurnstile() {
      if (this.isVerified) return;

      window.turnstile.render(`#${this.turnstileId}`, {
        sitekey: this.siteKey,
        theme: 'dark',
        size: 'normal',
        callback: this.onTurnstileSuccess,
        'error-callback': this.onTurnstileError,
      });
    },

    onTurnstileSuccess(token) {
      this.captchaToken = token;
    },

    onTurnstileError() {
      this.captchaToken = null;
    },

    async handleVerify() {
      if (!this.captchaToken) return;

      this.isLoading = true;

      try {
        // 验证 token（可选的后端验证）
        const response = await fetch(`${this.apiUrl}/api/verify-bot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: this.captchaToken })
        }).catch(() => null);

        // 即使请求失败也允许验证（前端备用）
        const data = response?.ok ? await response.json() : { success: true };

        if (data.success) {
          // 保存验证状态
          localStorage.setItem('bot-verified', 'true');
          localStorage.setItem('bot-verified-timestamp', Date.now().toString());

          this.isVerified = true;
        } else {
          alert('验证失败，请重试');
          window.turnstile?.reset(`#${this.turnstileId}`);
        }
      } catch (error) {
        console.error('验证错误:', error);
        alert('验证出错，请重试');
        window.turnstile?.reset(`#${this.turnstileId}`);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.bot-verification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

.verification-modal {
  position: relative;
  width: 90%;
  max-width: 420px;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(0, 212, 255, 0.1));
  border: 2px solid rgba(124, 58, 237, 0.4);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(124, 58, 237, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 60px rgba(124, 58, 237, 0.1);
}

.modal-content {
  position: relative;
  z-index: 1;
  padding: 50px 40px 40px;
  text-align: center;
}

.verification-icon {
  font-size: 64px;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

.modal-title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
}

.modal-desc {
  font-size: 14px;
  color: #aaa;
  margin: 0 0 32px;
  line-height: 1.5;
}

.turnstile-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

:deep(.cf-turnstile) {
  margin: 0 auto;
}

:deep(.cf-turnstile iframe) {
  border-radius: 6px;
}

.verify-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #7C3AED, #a855f7);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  letter-spacing: 0.5px;
}

.verify-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.6);
}

.verify-btn:active:not(:disabled) {
  transform: translateY(0px);
}

.verify-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.verify-btn.loading {
  pointer-events: none;
}

.btn-spinner {
  display: inline-block;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.modal-hint {
  font-size: 12px;
  color: #888;
  margin: 20px 0 0;
  letter-spacing: 0.3px;
}

@media (max-width: 480px) {
  .verification-modal {
    width: 95%;
    max-width: 100%;
  }

  .modal-content {
    padding: 40px 24px 32px;
  }

  .modal-title {
    font-size: 24px;
  }

  .verification-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .turnstile-wrapper {
    padding: 16px;
  }
}
</style>
