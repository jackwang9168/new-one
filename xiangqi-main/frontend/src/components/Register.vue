<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const phoneNumber = ref('')
const password = ref('')
const confirmPassword = ref('')
const verificationCode = ref('')
const isCodeSent = ref(false)
const countdown = ref(0)

// 后端 API 基础 URL 1.4修改
const API_BASE_URL = 'http://localhost:9090' // 统一使用 9090 端口

const validatePhoneNumber = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasValidLength = password.length >= 8 && password.length <= 16
  return hasUpperCase && hasLowerCase && hasNumbers && hasValidLength
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
  if (!validatePhoneNumber(phoneNumber.value)) {
    alert('请输入正确的手机号')
    return
  }

  // 禁用按钮 1.4修改，防止重复点击
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
    if (response.ok && data.success) {
      startCountdown()
      console.log('验证码已发送（请检查后端控制台或实际短信）')
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

const handleRegister = async () => {
  // 1. 前端验证
  if (!phoneNumber.value || !password.value || !confirmPassword.value || !verificationCode.value) {
    alert('请填写所有必填项')
    return
  }

  if (!validatePhoneNumber(phoneNumber.value)) {
    alert('请输入正确的手机号')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }

  if (!validatePassword(password.value)) {
    alert('密码必须包含大写字母、小写字母和数字，且长度为8-16位')
    return
  }

  // 可以在这里添加验证码格式检查
  if (!/^\d{6}$/.test(verificationCode.value)) {
    alert('请输入6位数字验证码');
    return;
  }


  // 2. 调用后端注册接口 (假设后端 /register 接口同时处理验证码校验)
  try {
    const response = await fetch(`${API_BASE_URL}/register`, { // 调用统一的注册接口
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber.value,
        password: password.value,
        code: verificationCode.value // 将验证码一起发送
      })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      alert('注册成功！即将跳转到登录页面。')
      router.push('/login') // 注册成功后跳转到登录页
    } else {
      // 显示后端返回的错误信息，更具体
      alert(data.message || `注册失败 (HTTP ${response.status})`)
    }
  } catch (error) {
    console.error('注册请求失败:', error)
    alert('注册请求失败，请检查网络或联系管理员')
  }
}

const goToLogin = () => {
  router.push('/login') // 明确跳转到登录页
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
  <div class="register-page">
    <div class="register-container">
      <h2>注册</h2>
      <div class="input-group">
        <input
          type="tel"
          v-model="phoneNumber"
          placeholder="请输入手机号"
          maxlength="11"
        >
        <!-- 发送验证码按钮现在在手机号输入框内 -->
        <button
          class="send-code-btn"
          @click="sendVerificationCode"
          :disabled="isCodeSent && countdown > 0"
        >
          {{ isCodeSent && countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
        </button>
      </div>
      <div class="input-group">
        <input
          type="text"
          v-model="verificationCode"
          placeholder="请输入6位验证码"
          maxlength="6"
        >
      </div>
      <div class="input-group">
        <input
          type="password"
          v-model="password"
          placeholder="请输入密码 (8-16位，含大小写字母和数字)"
        >
      </div>
      <div class="input-group">
        <input
          type="password"
          v-model="confirmPassword"
          placeholder="请再次确认密码"
        >
        <p class="password-hint">密码至少需要由大写字母、小写字母、数字组成，长度为8-16</p>
      </div>
      <div class="button-group">
        <button @click="handleRegister">注册</button>
        <button @click="goToLogin">返回登录</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 样式保持不变 */
.register-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('../pictures/1.webp');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0; 
  overflow: hidden;
}

.register-container {
  max-width: 400px;
  width: 90%;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 0.3);
  position: relative;
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
  right: 1px;
  top: 1px;
  bottom: 1px;
  padding: 0 10px;
  background-color: rgba(175, 76, 147, 0.6);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 14px;
  backdrop-filter: blur(3px);
  transition: all 0.3s ease;
}

.send-code-btn:disabled {
  background-color: rgba(204, 204, 204, 0.5);
  cursor: not-allowed;
}

/* 为手机号输入框添加右边距，防止文字与按钮重叠 */
.input-group input[type="tel"] {
  padding-right: 110px; /* 调整这个值适应按钮宽度 */
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

.password-hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 5px;
  text-align: left;
}
</style>