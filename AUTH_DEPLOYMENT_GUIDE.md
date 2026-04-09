# 身份认证系统部署和测试指南

## 快速开始

### 本地开发运行

1. **配置环境变量**

前端 (`.env.local`)：
```bash
VUE_APP_API_URL=http://localhost:5000
VUE_APP_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

后端 (`server/.env`)：
```bash
# 数据库（本地SQLite用于开发，生产使用Neon）
DATABASE_URL=postgresql://user:password@localhost/yourdb

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRE=7d

# 邮件SMTP（可选，开发可跳过）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourapp.com

# Cloudflare Turnstile
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# 应用
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:8080
```

2. **启动开发服务器**

```bash
npm run dev
```

这会并行启动：
- 前端：http://localhost:8080
- 后端：http://localhost:5000

### 本地数据库设置

#### 使用PostgreSQL（推荐）

1. 安装PostgreSQL并创建数据库：
```sql
CREATE DATABASE pc_tracker;
```

2. 运行schema初始化：
```bash
psql pc_tracker < server/db/schema.sql
```

#### 开发环境快速测试（无需真实数据库）

后端会在没有Neon连接时返回模拟响应。通过修改 `server/routes/auth.js` 中的处理来使用内存存储进行本地测试：

```javascript
// 开发模式：使用内存存储
const users = {}; // 键：邮箱，值：用户对象
```

## Vercel部署

### 前置条件

1. **Neon PostgreSQL账户**
   - 创建账户：https://neon.tech
   - 创建数据库项目
   - 获取连接字符串

2. **Cloudflare账户**
   - 创建Turnstile Site Key：https://dash.cloudflare.com
   - 记录Site Key和Secret Key

3. **邮件服务**
   - 使用Gmail：生成应用密码
   - 或其他SMTP服务提供商

### 环境变量配置

在Vercel项目设置中添加以下环境变量：

```
# 数据库
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-chars
JWT_EXPIRE=7d

# 邮件
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
SMTP_FROM=noreply@pc-tracker.com

# Cloudflare Turnstile
VITE_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key

# 应用
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.vercel.app
```

### 初始化数据库

在部署后，需要运行一次数据库初始化：

```bash
# 通过Vercel CLI连接到生产环境
vercel env pull

# 初始化schema（需要本地运行）
psql $DATABASE_URL < server/db/schema.sql
```

或使用Neon Web控制台直接运行SQL脚本。

### GitHub集成部署

1. 推送代码到GitHub
2. Vercel自动构建和部署
3. 完成后获得生产URL

## 核心工作流程

### 1. 用户注册

```
用户输入邮箱
  ↓
输入密码 + 确认密码
  ↓
Cloudflare Turnstile验证
  ↓
点击注册 → 后端验证 → 哈希密码 → 保存用户
  ↓
生成6位验证码 → 发送邮件
  ↓
用户收到验证码并输入
  ↓
5分钟内验证成功
  ↓
用户可登录
```

### 2. 验证码限流

- **5小时内最多5次申请**
- **最小间隔30分钟**
- **每次验证码有效期5分钟**

限流存储在 `verification_attempts` 表：
```sql
SELECT * FROM verification_attempts
WHERE email = 'user@example.com'
AND reset_at > NOW();
```

### 3. 用户登录

```
用户输入邮箱 + 密码
  ↓
验证邮箱是否已验证
  ↓
bcrypt比对密码
  ↓
生成JWT令牌 → 返回给客户端
  ↓
客户端保存到localStorage
  ↓
后续API请求自动添加Authorization header
```

### 4. AI聊天保护

未登录用户访问ChatBox时：
- 显示"🔐 功能已锁定"提示
- 提供登录按钮
- 点击后弹出登录模态框
- 登录成功后可使用聊天功能

## 测试清单

### ✅ 本地测试

- [ ] **注册流程**
  - [ ] 邮箱格式验证（无@符号时提示）
  - [ ] 密码长度要求（< 6个字符时禁用提交）
  - [ ] 密码确认检查（不一致时提示）
  - [ ] Turnstile验证弹出（需配置Site Key）
  - [ ] 注册成功后显示验证码页面

- [ ] **邮箱验证**
  - [ ] 验证码5分钟倒计时正常
  - [ ] 输入正确验证码验证成功
  - [ ] 输入错误验证码提示错误
  - [ ] 验证码过期后无法验证
  - [ ] 重新发送按钮在30分钟内禁用
  - [ ] 5小时内超过5次提示限流

- [ ] **登录流程**
  - [ ] 未验证邮箱无法登录
  - [ ] 错误密码提示"邮箱或密码错误"
  - [ ] 正确凭证返回JWT令牌
  - [ ] 导航栏显示用户邮箱

- [ ] **AI聊天保护**
  - [ ] 未登录时显示登录提示
  - [ ] 点击提示后弹出登录模态框
  - [ ] 登录成功后ChatBox变为可用
  - [ ] 登出后ChatBox恢复锁定

- [ ] **边界情况**
  - [ ] 邮箱重复注册提示
  - [ ] 网络错误时显示错误信息
  - [ ] 快速连续提交防护

### ✅ Vercel生产测试

- [ ] 数据库连接正常
- [ ] 邮件发送成功
- [ ] Cloudflare Turnstile验证工作
- [ ] JWT令牌跨域验证正常
- [ ] 用户数据正确存储在Neon
- [ ] API响应时间 < 500ms
- [ ] 错误日志正确记录

## 故障排查

### 问题：验证码邮件不发送

**解决**：
1. 检查SMTP配置是否正确
2. Gmail需要生成应用密码（非账户密码）
3. 检查Vercel环境变量是否设置
4. 查看服务器日志：`vercel logs`

### 问题：Turnstile验证失败

**解决**：
1. 确认Site Key和Secret Key配对正确
2. 在Cloudflare控制面板验证Domain配置
3. 清浏览器缓存重试
4. 检查本地是否使用 `1x00000...` 开发密钥

### 问题：数据库连接失败

**解决**：
1. 验证Neon连接字符串格式正确
2. 检查IP是否在Neon白名单中
3. 运行 `node -e "require('pg').connect(process.env.DATABASE_URL, console.log)"`
4. 查看Neon Web控制面板日志

### 问题：前端无法连接后端

**解决**：
1. 确认 `VUE_APP_API_URL` 环境变量正确
2. 检查CORS配置（后端已配置）
3. 浏览器控制台查看具体错误信息
4. 检查后端是否在运行

## API端点参考

### 认证相关

| 方法 | 端点 | 请求体 | 响应 |
|------|------|--------|------|
| POST | /api/auth/register | email, password, confirmPassword, turnstileToken | { success, email, expiresAt } |
| POST | /api/auth/login | email, password | { success, token, user } |
| POST | /api/auth/verify-email | email, code | { success } |
| POST | /api/auth/resend-code | email | { success, expiresAt } |
| GET | /api/auth/verify-token | Header: Authorization | { valid, user } |

### 示例请求

注册：
```javascript
const res = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    turnstileToken: 'token-from-widget'
  })
});
```

登录后的请求：
```javascript
const res = await fetch('http://localhost:5000/api/components', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 性能优化建议

1. **连接池**：后端已使用pg连接池
2. **缓存**：在前端缓存user信息
3. **CDN**：部署时启用Vercel CDN
4. **数据库索引**：已在schema中创建关键索引

## 安全建议

1. ✅ 密码哈希使用bcrypt（10轮盐）
2. ✅ JWT密钥储存在环境变量
3. ✅ 邮件验证防止自动化攻击
4. ✅ CORS已配置
5. 🔒 建议：定期更新`JWT_SECRET`
6. 🔒 建议：生产环境启用HTTPS only cookies
7. 🔒 建议：监控异常登录活动

## 后续扩展

- [ ] 电话验证支持
- [ ] OAuth社交登录（Google, GitHub）
- [ ] 双因素认证（2FA）
- [ ] 密码重置功能
- [ ] 登录记录和设备管理
- [ ] 速率限制和DDoS防护

---

**状态**：✅ 本地开发就绪 | 🚀 Vercel部署就绪 | 🔐 安全认证系统完成
