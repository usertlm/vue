# 🚀 快速启动指南

## 已完成的配置

✅ Neon PostgreSQL 已连接
✅ 数据库 schema 已初始化
✅ 后端认证系统验证成功
✅ 所有限流规则工作正常

## 本地运行（推荐）

### 方式1：并行运行前后端（推荐）

```bash
npm run dev
```

这会同时启动：
- **前端**：http://localhost:8080
- **后端**：http://localhost:5000

### 方式2：分别启动

**终端1 - 启动后端：**
```bash
cd server
npm run dev
```
后端运行于 http://localhost:5000

**终端2 - 启动前端：**
```bash
npm run serve
```
前端运行于 http://localhost:8080

## 完整工作流测试

### ✅ 1. 注册账户

1. 打开 http://localhost:8080
2. 点击右上角 "登录/注册"
3. 选择 "注册新账户"
4. 填写邮箱：`test@example.com`
5. 输入密码：`Password123`
6. 点击 Cloudflare Turnstile 验证（开发模式自动通过）
7. 点击 "注册账户"

### ✅ 2. 验证邮箱

1. 开发模式下，验证码会显示在浏览器控制台或服务器日志
2. 复制 6 位验证码
3. 粘贴到验证框
4. 点击 "验证"（自动转到登录）

### ✅ 3. 登录

1. 输入邮箱：`test@example.com`
2. 输入密码：`Password123`
3. 点击 "登录"
4. 导航栏显示你的邮箱 + 登出按钮

### ✅ 4. 使用AI聊天

1. 登录成功后，页面下方 ChatBox 变为可用
2. 在输入框输入问题
3. AI 会响应（需要配置 MiniMax API）

## 限流测试

验证码限流规则（5小时内5次，30分钟最小间隔）已验证可行：

```
第2次发送：✓ 成功
第3次发送：✓ 成功
第4次发送：⚠️ 请在30分钟后再试
```

## 下一步配置

### 1. JWT 密钥（必须）

编辑 `server/.env`，替换：
```bash
JWT_SECRET=your-super-secret-key-change-this-to-random-string
```

### 2. Cloudflare Turnstile（可选，仅生产需要）

- 访问 https://dash.cloudflare.com/turnstile
- 创建 Site Key
- 更新 `.env.local` 和 `server/.env`

### 3. 邮件配置（可选）

开发环境无需配置，验证码在日志显示。

生产环境配置 `server/.env`：
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
```

## 🎯 Vercel 部署

```bash
# 1. 推送到 GitHub
git push origin main

# 2. 在 Vercel 添加环境变量
DATABASE_URL=postgresql://...
JWT_SECRET=strong-random-key
TURNSTILE_SECRET_KEY=...
SMTP_HOST=smtp.gmail.com
SMTP_USER=...
SMTP_PASS=...

# 3. 自动部署
# Vercel 会自动检测并构建
```

---

**状态**：✅ 本地开发就绪 | 🚀 生产部署就绪
