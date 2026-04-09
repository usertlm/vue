<template>
  <div id="app">
    <!-- 认证导航栏 -->
    <div class="auth-navbar">
      <div class="navbar-content">
        <span class="app-title">PC配件价格追踪</span>
        <div class="navbar-right">
          <span v-if="isAuthenticated" class="user-email">{{ userEmail }}</span>
          <button
            v-if="isAuthenticated"
            @click="handleLogout"
            class="logout-btn"
          >
            登出
          </button>
          <button
            v-else
            @click="showAuthModal = true"
            class="login-btn"
          >
            登录/注册
          </button>
        </div>
      </div>
    </div>

    <!-- 登录/注册模态框 -->
    <div v-if="showAuthModal && !isAuthenticated" class="modal-overlay" @click.self="showAuthModal = false">
      <div class="modal-content">
        <button class="close-btn" @click="showAuthModal = false">×</button>
        <AuthLayout @login-success="handleAuthSuccess" />
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="app-content">
      <HlsPlayer src="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8" />
      <HelloWorld msg="👇👇👇"/>

      <!-- 电脑配件价格趋势系统 -->
      <div class="price-trend-section">
        <ComponentSelector
          @update:selected="handleSelectionChange"
          @view-chart="handleViewChart"
        />
        <PriceTrendChartAdvanced
          :selectedIds="selectedComponentIds"
          @remove="removeComponentFromChart"
        />
      </div>

      <SearchComponent />

      <!-- AI聊天（需要认证） -->
      <div class="chat-section">
        <AuthGuard>
          <ChatBox />
        </AuthGuard>
      </div>

      <svg
        class="icon-link"
        @click="goToWebsite"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </div>
  </div>
</template>

<script>
import { isAuthenticated, getUserEmail, removeToken } from './utils/auth';
import HelloWorld from './components/HelloWorld.vue';
import SearchComponent from './components/search.vue';
import HlsPlayer from './components/HlsPlayer.vue';
import ChatBox from './components/ChatBox.vue';
import AuthGuard from './components/auth/AuthGuard.vue';
import AuthLayout from './components/auth/AuthLayout.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    SearchComponent,
    HlsPlayer,
    ChatBox,
    AuthGuard,
    AuthLayout,
    ComponentSelector: () => import('./components/ComponentSelector.vue'),
    PriceTrendChartAdvanced: () => import('./components/PriceTrendChartAdvanced.vue'),
  },
  data() {
    return {
      selectedComponentIds: [],
      showAuthModal: false
    };
  },
  computed: {
    isAuthenticated() {
      return isAuthenticated();
    },
    userEmail() {
      return getUserEmail();
    }
  },
  methods: {
    goToWebsite() {
      window.open('http://www.staggeringbeauty.com/', '_blank')
    },
    handleSelectionChange(ids) {
      this.selectedComponentIds = ids;
    },
    handleViewChart(ids) {
      this.selectedComponentIds = ids;
      setTimeout(() => {
        const chartElement = document.querySelector('.price-trend-section');
        if (chartElement) {
          chartElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    },
    removeComponentFromChart(id) {
      const index = this.selectedComponentIds.indexOf(id);
      if (index > -1) {
        this.selectedComponentIds.splice(index, 1);
      }
    },
    handleAuthSuccess() {
      this.showAuthModal = false;
      this.$forceUpdate();
    },
    handleLogout() {
      removeToken();
      this.$forceUpdate();
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Orbitron', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image: linear-gradient(135deg, #0f2027 0%, #2c5364 100%), url('@/assets/20231220_163216.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
}

.auth-navbar {
  position: sticky;
  top: 0;
  background: rgba(15, 32, 39, 0.95);
  border-bottom: 2px solid #00ffe7;
  box-shadow: 0 4px 20px rgba(0, 255, 231, 0.2);
  z-index: 999;
  padding: 12px 0;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  color: #00ffe7;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 0 10px #00ffe7;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-email {
  color: #00ffe7;
  font-size: 14px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn,
.login-btn {
  padding: 8px 16px;
  border: 2px solid #00ffe7;
  background: rgba(0, 255, 231, 0.1);
  color: #00ffe7;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s;
}

.logout-btn:hover,
.login-btn:hover {
  background: rgba(0, 255, 231, 0.2);
  box-shadow: 0 0 10px rgba(0, 255, 231, 0.4);
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
  z-index: 1001;
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

.app-content {
  color: #00ffe7;
  text-align: center;
  padding-top: 20px;
  margin-top: 0;
}

.neon {
  text-shadow: 0 0 5px #00ffe7, 0 0 10px #00ffe7, 0 0 20px #00ffe7, 0 0 40px #00ffe7;
}

.glass {
  background: rgba(255,255,255,0.08);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 4px 32px 0 rgba(0,255,231,0.15);
  padding: 24px;
  margin: 24px auto;
  max-width: 800px;
}

.price-trend-section {
  margin: 60px auto;
  padding: 0 20px;
}

.chat-section {
  margin: 60px auto;
  padding: 0 20px;
  box-shadow: 0 0 40px #00ffe7 inset;
  border-radius: 16px;
}

.icon-link {
  cursor: pointer;
  fill: #00ffe7;
  transition: fill 0.3s, filter 0.3s;
  filter: drop-shadow(0 0 6px #00ffe7);
  margin: 20px 0;
}

.icon-link:hover {
  fill: #66b1ff;
  filter: drop-shadow(0 0 12px #66b1ff);
}

/* 响应式 */
@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 10px;
  }

  .navbar-right {
    width: 100%;
    justify-content: center;
    gap: 10px;
  }

  .user-email {
    max-width: 150px;
  }

  .modal-content {
    padding: 30px;
  }
}
</style>
