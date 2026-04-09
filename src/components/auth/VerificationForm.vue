<template>
  <div class="verification-form">
    <h2>验证邮箱</h2>
    <p class="email-info">验证码已发送到: <strong>{{ email }}</strong></p>

    <div class="form-group">
      <label>验证码</label>
      <input
        v-model="code"
        type="text"
        placeholder="请输入6位验证码"
        maxlength="6"
        @input="validateCode"
        :disabled="isLoading || isCodeExpired"
      />
    </div>

    <!-- 剩余时间显示 -->
    <div class="timer-info">
      <div v-if="!isCodeExpired" class="timer">
        ⏱️ 验证码有效期: <strong>{{ remainingTime }}</strong> 秒
      </div>
      <div v-else class="expired">
        ❌ 验证码已过期，请重新发送
      </div>
    </div>

    <!-- 限流提示 -->
    <div v-if="rateLimitMessage" class="rate-limit-message">
      ⚠️ {{ rateLimitMessage }}
    </div>

    <div v-if="errorMessage" class="error-message">
      ⚠️ {{ errorMessage }}
    </div>

    <div class="button-group">
      <button
        @click="handleVerify"
        :disabled="isLoading || code.length !== 6 || isCodeExpired"
        class="submit-btn"
      >
        {{ isLoading ? '验证中...' : '验证' }}
      </button>

      <button
        @click="handleResend"
        :disabled="isResending || cannotResend || isCodeExpired"
        class="resend-btn"
      >
        {{ isResending ? '发送中...' : cannotResend ? `${resendWaitTime}s 后重新发送` : '重新发送验证码' }}
      </button>
    </div>

    <p class="switch-text">
      <a @click="$emit('back')" href="javascript:;">返回注册</a>
    </p>
  </div>
</template>

<script>
import { authAPI } from '@/utils/api';
import { setUserEmail } from '@/utils/auth';

export default {
  name: 'VerificationForm',
  props: {
    email: String,
    expiresAt: String
  },
  data() {
    return {
      code: '',
      errorMessage: '',
      rateLimitMessage: '',
      isLoading: false,
      isResending: false,
      isCodeExpired: false,
      remainingTime: 300, // 5分钟 = 300秒
      resendWaitTime: 0,
      cannotResend: false
    };
  },
  mounted() {
    // 启动计时器
    this.startCodeTimer();
    this.startResendTimer();
  },
  beforeUnmount() {
    // 清理定时器
    if (this.codeTimer) clearInterval(this.codeTimer);
    if (this.resendTimer) clearInterval(this.resendTimer);
  },
  methods: {
    startCodeTimer() {
      this.codeTimer = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime <= 0) {
          this.isCodeExpired = true;
          clearInterval(this.codeTimer);
        }
      }, 1000);
    },
    startResendTimer() {
      // 接下来30分钟不能再发送验证码（从localStorage记录）
      const lastSendTime = localStorage.getItem('last_verification_send');
      if (lastSendTime) {
        const elapsed = (Date.now() - parseInt(lastSendTime)) / 1000;
        const remaining = Math.max(0, 1800 - elapsed); // 30分钟 = 1800秒
        if (remaining > 0) {
          this.cannotResend = true;
          this.resendWaitTime = Math.ceil(remaining);
          this.resendTimer = setInterval(() => {
            this.resendWaitTime--;
            if (this.resendWaitTime <= 0) {
              this.cannotResend = false;
              clearInterval(this.resendTimer);
            }
          }, 1000);
        }
      }
    },
    validateCode() {
      // 只允许输入数字
      this.code = this.code.replace(/\D/g, '');
    },
    async handleVerify() {
      this.errorMessage = '';

      if (this.code.length !== 6) {
        this.errorMessage = '请输入完整的6位验证码';
        return;
      }

      this.isLoading = true;
      try {
        await authAPI.verifyEmail(this.email, this.code);
        setUserEmail(this.email);
        this.$emit('verify-success');
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    async handleResend() {
      this.errorMessage = '';
      this.rateLimitMessage = '';

      if (this.cannotResend) {
        this.rateLimitMessage = `请在${this.resendWaitTime}秒后重新发送`;
        return;
      }

      this.isResending = true;
      try {
        const response = await authAPI.resendCode(this.email);
        console.log('Resend response:', response);

        // 重置计时器
        this.remainingTime = 300;
        this.isCodeExpired = false;
        if (this.codeTimer) clearInterval(this.codeTimer);
        this.startCodeTimer();

        // 记录发送时间
        localStorage.setItem('last_verification_send', Date.now().toString());
        this.cannotResend = true;
        this.resendWaitTime = 1800; // 30分钟
        if (this.resendTimer) clearInterval(this.resendTimer);
        this.startResendTimer();

        // 调试模式显示验证码
        if (response.code) {
          console.log('Debug mode - verification code:', response.code);
        }
      } catch (error) {
        this.rateLimitMessage = error.message;
      } finally {
        this.isResending = false;
      }
    }
  }
};
</script>

<style scoped>
.verification-form {
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
  margin-bottom: 10px;
  font-size: 24px;
}

.email-info {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
}

.email-info strong {
  color: #00ffe7;
  word-break: break-all;
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
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  text-align: center;
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

.timer-info {
  text-align: center;
  margin: 20px 0;
  font-size: 14px;
}

.timer {
  color: #fb6f3d;
  background: #fff5f0;
  padding: 8px;
  border-radius: 6px;
}

.timer strong {
  color: #ff4500;
  font-size: 16px;
  font-weight: bold;
}

.expired {
  color: #d32f2f;
  background: #ffe0e0;
  padding: 8px;
  border-radius: 6px;
}

.rate-limit-message {
  background: #fff3cd;
  color: #856404;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.error-message {
  background: #ffe0e0;
  color: #d32f2f;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.submit-btn,
.resend-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn {
  background: linear-gradient(135deg, #00ffe7, #0099cc);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 255, 231, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.resend-btn {
  background: #f0f0f0;
  color: #333;
  border: 2px solid #e0e0e0;
}

.resend-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.resend-btn:disabled {
  background: #f5f5f5;
  color: #999;
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
