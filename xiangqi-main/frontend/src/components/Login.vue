<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const phoneNumber = ref('')
const password = ref('')
const verificationCode = ref('')
const isCodeSent = ref(false)
const countdown = ref(0)
const loginType = ref('password') // 'password' 或 'code'

// 后端 API 基础 URL 全局设置1.4修改
const API_BASE_URL = 'http://localhost:9090'

// 启用手机号验证1.4修改
const validatePhoneNumber = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

let countdownTimer = null; // 用于存储定时器 ID

const startCountdown = () => {
  // 清除之前的定时器（如果有）
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null; // 清除 ID
      isCodeSent.value = false; // 允许重新发送
    }
  }, 1000)
}

const sendVerificationCode = async () => {
  // 启用手机号验证
  if (!validatePhoneNumber(phoneNumber.value)) {
    alert('请输入正确的手机号')
    return
  }

  // 禁用按钮，防止重复点击
  isCodeSent.value = true;

  try {
    const response = await fetch(`${API_BASE_URL}/verify-phone`, { // 使用后端地址
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber.value
      })
    })

    const data = await response.json()
    if (response.ok && data.success) { // 检查 HTTP 状态码和业务成功标志
      startCountdown()
      console.log('验证码已发送（请检查后端控制台或实际短信）')
      // 可以给用户一个更友好的提示
      // alert('验证码已发送，请注意查收。');
    } else {
      alert(data.message || `发送验证码失败 (HTTP ${response.status})`)
      isCodeSent.value = false; // 发送失败，允许重试
    }
  } catch (error) {
    console.error('发送验证码请求失败:', error)
    alert('发送验证码请求失败，请检查网络或联系管理员')
    isCodeSent.value = false; // 请求异常，允许重试
  }
}

const handleLogin = async () => {
  // 启用验证
  if (!validatePhoneNumber(phoneNumber.value)) {
    alert('请输入正确的手机号')
    return
  }

  let url = ''
  let payload = {}

  if (loginType.value === 'password') {
    if (!password.value) {
      alert('请输入密码')
      return
    }
    url = `${API_BASE_URL}/login` // 使用后端地址
    payload = {
      phone: phoneNumber.value,
      password: password.value
    }
  } else { // loginType === 'code'
    if (!verificationCode.value) {
      alert('请输入验证码')
      return
    }
     // 可以在这里添加验证码格式检查，例如必须是6位数字
    if (!/^\d{6}$/.test(verificationCode.value)) {
      alert('请输入6位数字验证码');
      return;
    }
    url = `${API_BASE_URL}/login-by-code` // 使用后端地址
    payload = {
      phone: phoneNumber.value,
      code: verificationCode.value
    }
  }

  // 执行登录请求
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (response.ok && data.success) {
      // --- 重要：处理登录成功后的 Token ---
      // 假设后端成功时返回 { success: true, token: 'your_jwt_token', ... }
      if (data.token) {
         localStorage.setItem('authToken', data.token); // 将 token 存储在 localStorage
         console.log('登录成功，Token 已存储');
      } else {
         console.warn('登录成功，但后端未返回 Token');
         // 根据你的应用逻辑，决定没有 token 是否能继续
      }
      // --- Token 处理结束 ---

      router.push('/home') // 跳转到首页
    } else {
      alert(data.message || `登录失败 (HTTP ${response.status})`)
    }
  } catch (error) {
    console.error('登录请求失败:', error)
    alert('登录请求失败，请检查网络或联系管理员')
  }
}

const goToRegister = () => {
  router.push('/register')
}

const switchLoginType = () => {
  loginType.value = loginType.value === 'password' ? 'code' : 'password'
  verificationCode.value = ''
  password.value = ''
  // 切换时重置验证码发送状态和倒计时
  isCodeSent.value = false
  countdown.value = 0
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null;
  }
}

// 组件卸载时清除定时器
import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <h2>登录</h2>
      <div class="input-group">
        <input
          type="tel"
          v-model="phoneNumber"
          placeholder="请输入手机号"
          maxlength="11"
        >
      </div>

      <div v-if="loginType === 'password'" class="input-group">
        <input
          type="password"
          v-model="password"
          placeholder="请输入密码"
        >
      </div>

      <div v-else class="input-group">
        <input
          type="text"
          v-model="verificationCode"
          placeholder="请输入6位验证码"
          maxlength="6"
        >
        <button
          class="send-code-btn"
          @click="sendVerificationCode"
          :disabled="isCodeSent && countdown > 0"
        >
          {{ isCodeSent && countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
        </button>
      </div>

      <div class="login-type-switch">
        <a @click="switchLoginType">
          {{ loginType === 'password' ? '使用验证码登录' : '使用密码登录' }}
        </a>
      </div>

      <div class="button-group">
        <button @click="handleLogin">登录</button>
        <button @click="goToRegister">注册</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 样式保持不变 */
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;/* 居中对齐 */
  background-image: url('../pictures/1.webp');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.login-container {
  max-width: 400px;
  width: 90%;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 0.3);
  position: relative;/* 用于内部元素定位（如发送验证码按钮）*/
  z-index: 1;
  backdrop-filter: blur(3px);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.7);
}

.input-group {
  margin-bottom: 15px;
  position: relative;
}

input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box; /* 确保 padding 不会撑大输入框 */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(3px);
  color: rgba(0, 0, 0, 0.8);
}

input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.send-code-btn {
  position: absolute;
  right: 1px; /* 调整位置，避免与输入框边框重叠 */
  top: 1px;   /* 调整位置 */
  bottom: 1px; /* 调整位置 */
  padding: 0 10px; /* 调整内边距 */
  background-color: rgba(175, 76, 147, 0.6);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0; /* 调整圆角以贴合输入框 */
  cursor: pointer;
  font-size: 14px;
  backdrop-filter: blur(3px);
  transition: all 0.3s ease;
  /* 移除 transform ，因为 top/bottom/right 已定位 */
}

.send-code-btn:disabled {
  background-color: rgba(204, 204, 204, 0.5);
  cursor: not-allowed;
}

/* 为验证码输入框添加一些右边距，防止文字与按钮重叠 */
.input-group input[type="text"] {
  padding-right: 110px; /* 调整这个值适应按钮宽度 */
}

.login-type-switch {
  text-align: right;
  margin-bottom: 15px;
}

.login-type-switch a {
  color: rgba(175, 76, 147, 0.8);
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.login-type-switch a:hover {
  text-decoration: underline;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: rgba(175, 76, 147, 0.6);
  color: white;
  font-size: 16px;
  cursor: pointer;
  backdrop-filter: blur(3px);
  transition: all 0.3s ease;
}

button:hover {
  background-color: rgba(175, 76, 147, 0.8);
}
</style>