const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const SMSClient = require('@alicloud/sms-sdk');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 阿里云短信服务配置
// const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID;
// const secretAccessKey = process.env.ALIYUN_ACCESS_KEY_SECRET;
// const smsClient = new SMSClient({ accessKeyId, secretAccessKey });

// 中间件
app.use(cors());
app.use(express.json());

// 模拟用户数据库
const users = new Map();

// 手机号验证接口
app.post('/verify-phone', async (req, res) => {
  try {
    const { phone } = req.body;

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: '手机号格式不正确' 
      });
    }

    // 检查手机号是否已注册
    if (users.has(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: '该手机号已被注册' 
      });
    }

    // 生成6位验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    console.log(`验证码已发送到 ${phone}: ${verificationCode}`);

    // 存储验证码信息
    users.set(phone, {
      verificationCode,
      timestamp: Date.now()
    });

    res.json({ 
      success: true, 
      message: '验证码已发送' 
    });
  } catch (error) {
    console.error('验证手机号时出错:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 验证码验证接口
app.post('/verify-code', (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!users.has(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: '请先获取验证码' 
      });
    }

    const userData = users.get(phone);
    
    // 验证码有效期5分钟
    if (Date.now() - userData.timestamp > 5 * 60 * 1000) {
      users.delete(phone);
      return res.status(400).json({ 
        success: false, 
        message: '验证码已过期' 
      });
    }

    if (userData.verificationCode !== parseInt(code)) {
      return res.status(400).json({ 
        success: false, 
        message: '验证码错误' 
      });
    }

    // 验证成功，清除验证码
    users.delete(phone);

    res.json({ 
      success: true, 
      message: '验证成功' 
    });
  } catch (error) {
    console.error('验证验证码时出错:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 注册接口
app.post('/register', (req, res) => {
  try {
    const { phone, password } = req.body;

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: '手机号格式不正确' 
      });
    }

    // 检查手机号是否已注册
    if (users.has(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: '该手机号已被注册' 
      });
    }

    // 存储用户信息
    users.set(phone, {
      password,
      registeredAt: Date.now()
    });

    res.json({ 
      success: true, 
      message: '注册成功' 
    });
  } catch (error) {
    console.error('注册时出错:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 