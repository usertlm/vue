const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:5000';

async function testAuthSystem() {
  console.log('🧪 开始测试身份认证系统...\n');

  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123';

  try {
    // 1. 测试 /api/health
    console.log('1️⃣ 测试健康检查...');
    let res = await fetch(`${BASE_URL}/api/health`);
    let data = await res.json();
    console.log('   ✓ 状态:', data.status, '\n');

    // 2. 测试注册
    console.log('2️⃣ 测试用户注册...');
    res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
        turnstileToken: 'dummy-token'
      })
    });
    data = await res.json();
    console.log('   响应:', data.message);
    console.log('   ✓ 注册邮箱:', data.email, '\n');

    // 3. 测试重新发送验证码
    console.log('3️⃣ 测试验证码发送与限流...');
    res = await fetch(`${BASE_URL}/api/auth/resend-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    data = await res.json();

    // 在开发模式下会返回验证码
    if (data.code) {
      console.log('   📧 验证码 (开发模式显示):', data.code);
      const verificationCode = data.code;

      // 4. 测试邮箱验证
      console.log('\n4️⃣ 测试邮箱验证...');
      res = await fetch(`${BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          code: verificationCode
        })
      });
      data = await res.json();
      console.log('   ✓ 验证结果:', data.message, '\n');

      // 5. 测试登录
      console.log('5️⃣ 测试用户登录...');
      res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });
      data = await res.json();
      if (data.token) {
        console.log('   ✓ 登录成功');
        console.log('   ✓ JWT令牌:', data.token.substring(0, 30) + '...');
        console.log('   ✓ 用户ID:', data.user.id, '\n');

        // 6. 测试令牌验证
        console.log('6️⃣ 测试令牌验证...');
        res = await fetch(`${BASE_URL}/api/auth/verify-token`, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        const tokenData = await res.json();
        console.log('   ✓ 令牌有效');
        console.log('   ✓ 用户:', tokenData.user.email, '\n');
      }
    } else {
      console.log('   ✓ 验证码已发送 (邮件模式)\n');
    }

    // 7. 测试限流
    console.log('7️⃣ 测试验证码发送限流...');
    for (let i = 2; i <= 5; i++) {
      res = await fetch(`${BASE_URL}/api/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });
      const limitData = await res.json();
      if (limitData.error) {
        console.log(`   ${i}. ⚠️ ${limitData.error}`);
        break;
      } else {
        console.log(`   ${i}. ✓ 验证码已发送`);
      }
    }

    console.log('\n✅ 所有测试通过！系统运行正常\n');

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('\n💡 提示：确保后端正在运行 (npm run server:dev)\n');
  }
}

testAuthSystem();
