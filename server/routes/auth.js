const express = require('express');
const router = express.Router();
const {
  registerUser,
  sendVerificationCode,
  verifyEmailCode,
  loginUser,
  generateJWT,
  verifyJWT
} = require('../services/authService');
const { sendVerificationCodeEmail } = require('../services/emailService');
const axios = require('axios');

// 注册接口
router.post('/register', async (req, res) => {
  try {
    const { email, password, confirmPassword, turnstileToken } = req.body;

    // 验证输入
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: '两次输入的密码不一致' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少需要6个字符' });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' });
    }

    // 验证Cloudflare Turnstile令牌
    if (process.env.NODE_ENV === 'production' && turnstileToken) {
      try {
        const verifyResponse = await axios.post(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken
          }
        );

        if (!verifyResponse.data.success) {
          return res.status(400).json({ error: '验证失败，请重试' });
        }
      } catch (error) {
        console.error('Turnstile verification error:', error);
        return res.status(400).json({ error: '验证服务暂时不可用' });
      }
    }

    // 注册用户
    const user = await registerUser(email, password);

    // 发送验证码
    const { code, expiresAt } = await sendVerificationCode(email);

    // 发送邮件
    try {
      await sendVerificationCodeEmail(email, code);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // 即使邮件发送失败，也返回成功，让用户知道可能需要检查邮件
      return res.json({
        success: true,
        message: '注册成功，请检查邮箱收取验证码',
        email: user.email,
        expiresAt
      });
    }

    res.json({
      success: true,
      message: '注册成功，请检查邮箱收取验证码',
      email: user.email,
      expiresAt
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ error: error.message || '注册失败' });
  }
});

// 重新发送验证码
router.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: '邮箱不能为空' });
    }

    // 发送验证码
    const { code, expiresAt } = await sendVerificationCode(email);

    // 发送邮件
    try {
      await sendVerificationCodeEmail(email, code);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // 邮件可能在开发环境中不配置，返回验证码用于本地测试
      if (process.env.NODE_ENV !== 'production') {
        return res.json({
          success: true,
          message: '[开发环境] 验证码',
          code,
          expiresAt
        });
      }
      throw emailError;
    }

    res.json({
      success: true,
      message: '验证码已重新发送，请检查邮箱',
      expiresAt
    });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(400).json({ error: error.message || '发送验证码失败' });
  }
});

// 验证邮箱
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: '邮箱和验证码不能为空' });
    }

    // 验证验证码
    await verifyEmailCode(email, code);

    res.json({
      success: true,
      message: '邮箱验证成功'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(400).json({ error: error.message || '邮箱验证失败' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    // 登录用户
    const user = await loginUser(email, password);

    // 生成JWT
    const token = generateJWT(user.id, user.email);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message || '登录失败' });
  }
});

// 验证令牌
router.get('/verify-token', (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        valid: false,
        error: '未提供授权令牌'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyJWT(token);

    res.json({
      valid: true,
      user: decoded
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      valid: false,
      error: '令牌无效或已过期'
    });
  }
});

// 登出（客户端删除token）
router.post('/logout', (req, res) => {
  // JWT是无状态的，所以登出只需要客户端删除token
  res.json({
    success: true,
    message: '已登出'
  });
});

module.exports = router;
