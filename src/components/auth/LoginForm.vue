<template>
  <div class="login-form">
    <h2>登录账户</h2>

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
        placeholder="请输入密码"
        :disabled="isLoading"
      />
    </div>

    <div v-if="errorMessage" class="error-message">
      ⚠️ {{ errorMessage }}
    </div>

    <button
      @click="handleLogin"
      :disabled="isLoading || !email || !password"
      class="submit-btn"
    >
      {{ isLoading ? '登录中...' : '登录' }}
    </button>

    <p class="switch-text">
      还没有账户？
      <a @click="$emit('switch-form')" href="javascript:;">注册新账户</a>
    </p>
  </div>
</template>

<script>
import { authAPI } from '@/utils/api';
import { setToken, setUserEmail } from '@/utils/auth';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';

      if (!this.email || !this.password) {
        this.errorMessage = '请填写所有字段';
        return;
      }

      this.isLoading = true;
      try {
        const response = await authAPI.login(this.email, this.password);
        setToken(response.token);
        setUserEmail(response.user.email);
        this.$emit('login-success');
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-form {
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
