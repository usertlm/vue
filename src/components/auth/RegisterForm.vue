<template>
  <div class="register-form">
    <h2>创建新账户</h2>

    <div class="form-group">
      <label>邮箱</label>
      <input
        v-model="email"
        type="email"
        placeholder="请输入邮箱"
        :disabled="isLoading"
      />
    </div>

    <div class="form-group">
      <label>密码</label>
      <input
        v-model="password"
        type="password"
        placeholder="请输入密码（至少6个字符）"
        :disabled="isLoading"
      />
      <small v-if="password.length > 0 && password.length < 6" class="warning">
        ⚠️ 密码至少需要6个字符
      </small>
    </div>

    <div class="form-group">
      <label>确认密码</label>
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="请再次输入密码"
        :disabled="isLoading"
      />
      <small v-if="confirmPassword && password !== confirmPassword" class="warning">
        ⚠️ 两次密码不一致
      </small>
    </div>

    <!-- Cloudflare Turnstile 验证框 -->
    <div class="turnstile-container">
      <div
        ref="turnstileWidget"
        class="cf-turnstile"
        :data-sitekey="process.env.VUE_APP_TURNSTILE_SITE_KEY"
        data-theme="light"
      ></div>
    </div>

    <div v-if="errorMessage" class="error-message">
      ⚠️ {{ errorMessage }}
    </div>

    <button
      @click="handleRegister"
      :disabled="isLoading || !isFormValid"
      class="submit-btn"
    >
      {{ isLoading ? '注册中...' : '注册账户' }}
    </button>

    <p class="switch-text">
      已有账户？
      <a @click="$emit('switch-form')" href="javascript:;">立即登录</a>
    </p>
  </div>
</template>

<script>
import { authAPI } from '@/utils/api';

export default {
  name: 'RegisterForm',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      isLoading: false,
      turnstileToken: null
    };
  },
  computed: {
    isFormValid() {
      return (
        this.email &&
        this.password &&
        this.confirmPassword &&
        this.password.length >= 6 &&
        this.password === this.confirmPassword
      );
    }
  },
  mounted() {
    // 加载Cloudflare Turnstile脚本
    this.loadTurnstileScript();
  },
  methods: {
    loadTurnstileScript() {
      if (window.turnstile) {
        this.initTurnstile();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => this.initTurnstile();
      document.head.appendChild(script);
    },
    initTurnstile() {
      if (this.$refs.turnstileWidget && window.turnstile) {
        window.turnstile.render(this.$refs.turnstileWidget, {
          sitekey: process.env.VUE_APP_TURNSTILE_SITE_KEY,
          theme: 'light',
          callback: this.onTurnstileSuccess
        });
      }
    },
    onTurnstileSuccess(token) {
      this.turnstileToken = token;
    },
    async handleRegister() {
      this.errorMessage = '';

      if (!this.isFormValid) {
        this.errorMessage = '请填写所有字段并确保密码一致';
        return;
      }

      this.isLoading = true;
      try {
        const response = await authAPI.register(
          this.email,
          this.password,
          this.confirmPassword,
          this.turnstileToken
        );

        // 注册成功，切换到验证码表单
        this.$emit('register-success', {
          email: this.email,
          expiresAt: response.expiresAt
        });
      } catch (error) {
        this.errorMessage = error.message;
        // 重置验证码
        if (window.turnstile) {
          window.turnstile.reset(this.$refs.turnstileWidget);
        }
        this.turnstileToken = null;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 255, 231, 0.2);
  max-width: 400px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #00ffe7;
  margin-bottom: 30px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #00ffe7;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.warning {
  display: block;
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
}

.turnstile-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
}

.cf-turnstile {
  display: flex;
  justify-content: center;
}

.error-message {
  background: #ffe0e0;
  color: #d32f2f;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #00ffe7, #0099cc);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 255, 231, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-text {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.switch-text a {
  color: #00ffe7;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.switch-text a:hover {
  color: #0099cc;
  text-decoration: underline;
}
</style>
