const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { query } = require('../db/connection');

// 生成6位随机验证码
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 注册用户
const registerUser = async (email, password) => {
  try {
    // 检查用户是否存在
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('邮箱已被注册');
    }

    // 哈希密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Register user error:', error);
    throw error;
  }
};

// 生成并发送验证码
const sendVerificationCode = async (email) => {
  try {
    // 检查限流
    await checkVerificationLimit(email);

    // 生成验证码
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟后过期

    // 删除该邮箱的旧未使用验证码
    await query('DELETE FROM verification_codes WHERE email = $1 AND used = FALSE', [email]);

    // 保存新验证码
    await query(
      'INSERT INTO verification_codes (email, code, expires_at) VALUES ($1, $2, $3)',
      [email, code, expiresAt]
    );

    return { email, code, expiresAt };
  } catch (error) {
    console.error('Send verification code error:', error);
    throw error;
  }
};

// 检查认证限流（5小时5次，30分钟最小间隔）
const checkVerificationLimit = async (email) => {
  try {
    const now = new Date();
    const result = await query(
      'SELECT * FROM verification_attempts WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // 首次请求，创建记录
      const resetAt = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5小时后
      await query(
        'INSERT INTO verification_attempts (email, attempt_count, reset_at) VALUES ($1, $2, $3)',
        [email, 1, resetAt]
      );
      return;
    }

    const attempt = result.rows[0];

    // 如果reset_at已过期，重置计数
    if (new Date(attempt.reset_at) <= now) {
      const newResetAt = new Date(Date.now() + 5 * 60 * 60 * 1000);
      await query(
        'UPDATE verification_attempts SET attempt_count = 1, reset_at = $1, last_attempt_at = $2 WHERE email = $3',
        [newResetAt, now, email]
      );
      return;
    }

    // 检查是否超过5次限制
    if (attempt.attempt_count >= 5) {
      throw new Error('5小时内验证码申请已达上限（5次），请稍后再试');
    }

    // 检查30分钟最小间隔
    const lastAttempt = new Date(attempt.last_attempt_at);
    const minIntervalMs = 30 * 60 * 1000;
    if (now.getTime() - lastAttempt.getTime() < minIntervalMs) {
      const remainingSeconds = Math.ceil((minIntervalMs - (now.getTime() - lastAttempt.getTime())) / 1000);
      const remainingMinutes = Math.ceil(remainingSeconds / 60);
      throw new Error(`请在${remainingMinutes}分钟后再试`);
    }

    // 更新记录
    await query(
      'UPDATE verification_attempts SET attempt_count = attempt_count + 1, last_attempt_at = $1 WHERE email = $2',
      [now, email]
    );
  } catch (error) {
    console.error('Check verification limit error:', error);
    throw error;
  }
};

// 验证邮箱验证码
const verifyEmailCode = async (email, code) => {
  try {
    const result = await query(
      'SELECT * FROM verification_codes WHERE email = $1 AND code = $2 AND used = FALSE AND expires_at > NOW()',
      [email, code]
    );

    if (result.rows.length === 0) {
      throw new Error('验证码无效或已过期');
    }

    // 标记验证码为已使用
    await query(
      'UPDATE verification_codes SET used = TRUE WHERE email = $1 AND code = $2',
      [email, code]
    );

    // 更新用户为已验证
    await query(
      'UPDATE users SET verified = TRUE WHERE email = $1',
      [email]
    );

    // 清除限流记录
    await query(
      'DELETE FROM verification_attempts WHERE email = $1',
      [email]
    );

    return true;
  } catch (error) {
    console.error('Verify email code error:', error);
    throw error;
  }
};

// 用户登录
const loginUser = async (email, password) => {
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new Error('邮箱或密码错误');
    }

    const user = result.rows[0];

    // 检查邮箱是否验证
    if (!user.verified) {
      throw new Error('请先验证邮箱');
    }

    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error('邮箱或密码错误');
    }

    return user;
  } catch (error) {
    console.error('Login user error:', error);
    throw error;
  }
};

// 生成JWT令牌
const generateJWT = (userId, email) => {
  const token = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
  return token;
};

// 验证JWT令牌
const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateVerificationCode,
  registerUser,
  sendVerificationCode,
  checkVerificationLimit,
  verifyEmailCode,
  loginUser,
  generateJWT,
  verifyJWT
};
