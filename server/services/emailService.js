const nodemailer = require('nodemailer');

let transporter;

// 初始化邮件transporter
const initializeMailer = () => {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  console.log('Email transporter initialized');
};

// 发送验证码邮件
const sendVerificationCodeEmail = async (email, code) => {
  try {
    if (!transporter) {
      initializeMailer();
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'PC配件价格追踪 - 邮箱验证码',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%); color: #00ffe7; padding: 20px; border-radius: 8px; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
              .code { font-size: 32px; font-weight: bold; color: #00ffe7; text-align: center; letter-spacing: 5px; margin: 20px 0; }
              .warning { color: #ff6b6b; font-size: 14px; margin: 10px 0; }
              .footer { text-align: center; color: #999; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>邮箱验证</h1>
              </div>
              <div class="content">
                <p>亲爱的用户，</p>
                <p>感谢您使用PC配件价格追踪服务。请使用以下验证码完成邮箱验证：</p>
                <div class="code">${code}</div>
                <p>验证码有效期为 <strong>5分钟</strong>，请勿将此码分享给任何人。</p>
                <p class="warning">⚠️ 如果您没有进行此操作，请忽略此邮件。</p>
              </div>
              <div class="footer">
                <p>此邮件由自动化系统发送，请勿直接回复。</p>
                <p>&copy; 2026 PC配件价格追踪服务</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification code email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Send verification code email error:', error);
    throw new Error('邮件发送失败，请稍后再试');
  }
};

module.exports = {
  initializeMailer,
  sendVerificationCodeEmail
};
