<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const soundEnabled = ref(true)
const notificationsEnabled = ref(true)
const theme = ref('light')

const navigateTo = (path) => {
  router.push(path)
}

// 新增：返回上一页的函数
const goBack = () => {
  router.back()
}

const saveSettings = () => {
  // 这里可以添加保存设置的逻辑
  alert('设置已保存')
}
</script>

<template>
  <div class="settings-container">
    <nav class="navbar">
      <div class="nav-brand">象棋游戏</div>
      <div class="nav-links">
        <a @click="navigateTo('/home')">首页</a>
        <a @click="navigateTo('/profile')">个人信息</a>
        <a @click="navigateTo('/rankings')">排行榜</a>
        <a @click="navigateTo('/settings')" class="active">设置</a>
      </div>
    </nav>
    <main class="main-content">
       <!-- 新增：返回按钮 -->
       <button @click="goBack" class="back-btn top-left-back-btn">返回</button>
      <h1>设置</h1>
      <div class="settings-container-scroll">
        <div class="settings-section">
          <h2>基本设置</h2>
          <div class="setting-item">
            <span class="setting-label">声音</span>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" v-model="soundEnabled">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">通知</span>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" v-model="notificationsEnabled">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">主题</span>
            <div class="setting-control">
              <select v-model="theme">
                <option value="light">浅色</option>
                <option value="dark">深色</option>
                <option value="auto">自动</option>
              </select>
            </div>
          </div>
        </div>
        <div class="settings-section">
          <h2>账号设置</h2>
          <div class="setting-item">
            <span class="setting-label">修改密码</span>
            <div class="setting-control">
              <button class="action-btn">修改</button>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">绑定手机</span>
            <div class="setting-control">
              <button class="action-btn">更换</button>
            </div>
          </div>
        </div>
        <div class="settings-section">
          <h2>游戏设置</h2>
          <div class="setting-item">
            <span class="setting-label">棋盘主题</span>
            <div class="setting-control">
              <select>
                <option value="classic">经典</option>
                <option value="modern">现代</option>
                <option value="dark">暗黑</option>
                <option value="custom">自定义</option>
              </select>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">棋子音效</span>
            <div class="setting-control">
              <select>
                <option value="wood">木质</option>
                <option value="metal">金属</option>
                <option value="stone">石头</option>
                <option value="none">无</option>
              </select>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">走子提示</span>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="settings-section">
          <h2>隐私设置</h2>
          <div class="setting-item">
            <span class="setting-label">公开战绩</span>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">显示在线状态</span>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">允许好友邀请</span>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="settings-actions">
          <button class="save-btn" @click="saveSettings">保存设置</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.settings-container {
  width: 100vw;
  height: 100vh;
  background-image: url('../pictures/3.webp');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  overflow: hidden;
   /* 新增：为绝对定位的子元素提供基准 */
  position: relative;
}

.navbar {
  background-color: rgba(51, 51, 51, 0.3);
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  backdrop-filter: blur(3px);
}

.nav-brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: auto;
}

.nav-links {
  display: flex;
  gap: 1rem;
  margin-right: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
  position: relative;
}

.nav-links a:hover {
  background-color: rgba(85, 85, 85, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: white;
  transition: all 0.3s;
  transform: translateX(-50%);
}

.nav-links a:hover::after {
  width: 80%;
}

.nav-links a.active {
  background-color: rgba(175, 76, 147, 0.6);
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav-links a.active::after {
  width: 80%;
  background-color: white;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 90%;
  margin: 2rem auto;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(3px);
  color: rgba(0, 0, 0, 0.8);
   /* 新增：如果按钮放在这里，也需要相对定位 */
  position: relative;
}

h1 {
   /* 新增：为按钮留出空间 */
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: rgba(0, 0, 0, 0.8);
  text-align: center; /* 居中标题 */
}

h2 {
  margin-bottom: 1rem;
  color: rgba(0, 0, 0, 0.8);
  font-size: 1.2rem;
}

.settings-container-scroll {
  max-height: 70vh; /* 保持原有滚动高度 */
  overflow-y: auto;
  padding-right: 1rem; /* 保持内边距给滚动条 */
  scrollbar-width: thin;
  scrollbar-color: rgba(175, 76, 147, 0.6) rgba(255, 255, 255, 0.1);
}

.settings-container-scroll::-webkit-scrollbar {
  width: 8px;
}

.settings-container-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.settings-container-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(175, 76, 147, 0.6);
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.settings-container-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(175, 76, 147, 0.8);
}

.settings-section {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  backdrop-filter: blur(3px);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-weight: 500;
}

.setting-control {
  display: flex;
  align-items: center;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(204, 204, 204, 0.5);
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: rgba(175, 76, 147, 0.6);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* 下拉菜单样式 */
select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.3);
  color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(3px);
}

/* 按钮样式 */
.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: rgba(175, 76, 147, 0.6);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: rgba(175, 76, 147, 0.8);
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.save-btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 4px;
  background-color: rgba(175, 76, 147, 0.6);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background-color: rgba(175, 76, 147, 0.8);
}

/* 新增：返回按钮样式 */
.back-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  background-color: rgba(100, 100, 100, 0.6); /* 中性灰色 */
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.back-btn:hover {
  background-color: rgba(120, 120, 120, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

/* 新增：返回按钮定位（左上角） */
.top-left-back-btn {
  position: absolute;
  top: 1.5rem; /* 根据需要调整 */
  left: 1.5rem; /* 根据需要调整 */
  z-index: 10; /* 确保在其他元素之上 */
}
</style>