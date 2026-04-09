<template>
  <div class="auth-layout">
    <!-- 登录表单 -->
    <LoginForm
      v-if="currentForm === 'login'"
      @switch-form="currentForm = 'register'"
      @login-success="onLoginSuccess"
    />

    <!-- 注册表单 -->
    <RegisterForm
      v-if="currentForm === 'register'"
      @switch-form="currentForm = 'login'"
      @register-success="onRegisterSuccess"
    />

    <!-- 验证码表单 -->
    <VerificationForm
      v-if="currentForm === 'verify'"
      :email="registeredEmail"
      :expiresAt="verifyExpiresAt"
      @verify-success="onVerifySuccess"
      @back="currentForm = 'register'"
    />
  </div>
</template>

<script>
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';
import VerificationForm from './VerificationForm.vue';

export default {
  name: 'AuthLayout',
  components: {
    LoginForm,
    RegisterForm,
    VerificationForm
  },
  data() {
    return {
      currentForm: 'login',
      registeredEmail: '',
      verifyExpiresAt: null
    };
  },
  methods: {
    onLoginSuccess() {
      this.$emit('login-success');
    },
    onRegisterSuccess(data) {
      this.registeredEmail = data.email;
      this.verifyExpiresAt = data.expiresAt;
      this.currentForm = 'verify';
    },
    onVerifySuccess() {
      this.$emit('login-success');
    }
  }
};
</script>

<style scoped>
.auth-layout {
  width: 100%;
}
</style>
