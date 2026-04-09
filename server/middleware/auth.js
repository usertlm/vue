const { verifyJWT } = require('../services/authService');

// JWT验证中间件
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未提供授权令牌' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: '令牌无效或已过期' });
  }
};

module.exports = { verifyToken };
