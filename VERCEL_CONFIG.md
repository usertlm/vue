# Vercel 部署配置

在 Vercel Dashboard 中添加以下环境变量：

## 必须的环境变量

### 1. 数据库连接
```
DATABASE_URL=postgresql://neondb_owner:npg_dAf1TFYxHWZ8@ep-solitary-sun-amj1yxxz-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

### 2. JWT 认证密钥
```
JWT_SECRET=generate-a-strong-random-key-here-minimum-32-characters
JWT_EXPIRE=7d
```

💡 **生成强密钥**：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Cloudflare Turnstile（可选，开发无需）
```
VITE_TURNSTILE_SITE_KEY=your-site-key-from-cloudflare
TURNSTILE_SECRET_KEY=your-secret-key-from-cloudflare
```

获取地址：https://dash.cloudflare.com/turnstile

## 可选的邮件配置

如果开启邮件功能，添加：
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
SMTP_FROM=noreply@yourapp.com
```

## 其他配置

```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.vercel.app
```

## 部署步骤

### 1. Github 推送

```bash
git push origin main
```

### 2. Vercel 创建项目

- 访问 https://vercel.com
- 导入 GitHub 项目
- 选择 Vue 应用

### 3. 配置环境变量

- Project Settings → Environment Variables
- 添加所有上述变量

### 4. 部署

- 自动部署开始
- 等待完成（通常 2-3 分钟）
- 获得生产 URL

## 部署后验证

```bash
# 测试后端健康检查
curl https://your-domain.vercel.app/api/health

# 测试认证端点
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 故障排查

### 构建失败

检查日志：
```bash
vercel logs --tail
```

常见原因：
- npm 依赖版本冲突
- 环境变量未设置
- 数据库连接失败

### 数据库连接失败

验证连接字符串：
```bash
node -e "require('pg').connect(process.env.DATABASE_URL, console.log)"
```

### API 响应缓慢

检查数据库查询性能：
- 查看 Neon 控制面板
- 检查是否使用了连接池（✓ 已使用）

---

**状态**：✅ 本地就绪 | 🚀 部署就绪 | 等待 Vercel 配置
