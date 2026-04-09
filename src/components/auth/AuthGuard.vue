<template>
  <div class="auth-guard">
    <div v-if="isAuthenticated" class="protected-content">
      <slot></slot>
    </div>
    <div v-else class="login-prompt">
      <div class="prompt-card">
        <h3>🔐 功能已锁定</h3>
        <p>您需要登录才能使用此功能</p>
        <button @click="showLoginModal = true" class="unlock-btn">
          点击登录
        </button>
      </div>

      <!-- 登录模态框 -->
      <div v-if="showLoginModal" class="modal-overlay" @click.self="showLoginModal = false">
        <div class="modal-content">
          <button class="close-btn" @click="showLoginModal = false">×</button>
          <AuthLayout @login-success="handleLoginSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isAuthenticated } from '@/utils/auth';
import AuthLayout from './AuthLayout.vue';

export default {
  name: 'AuthGuard',
  components: {
    AuthLayout
  },
  data() {
    return {
      showLoginModal: false
    };
  },
  computed: {
    isAuthenticated() {
      return isAuthenticated();
    }
  },
  methods: {
    handleLoginSuccess() {
      this.$forceUpdate();
      this.showLoginModal = false;
    }
  }
};
</script>

<style scoped>
.auth-guard {
  width: 100%;
}

.protected-content {
  width: 100%;
}

.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.prompt-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 255, 231, 0.2);
  max-width: 400px;
}

.prompt-card h3 {
  color: #00ffe7;
  font-size: 24px;
  margin-bottom: 10px;
}

.prompt-card p {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
}

.unlock-btn {
  background: linear-gradient(135deg, #00ffe7, #0099cc);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.unlock-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 255, 231, 0.4);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: rgba(255, 255, 255, 0.98);
  padding: 40px;
  border-radius: 12px;
  max-width: 450px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 255, 231, 0.3);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 28px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #00ffe7;
}
</style>
