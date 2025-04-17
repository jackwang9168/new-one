<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}

const startGame = () => {
  router.push('/game')
}

const startOnlineBattle = () => {
  router.push('/game-lobby')
}

// 新增：返回上一页的函数
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="home-container">
    <nav class="navbar">
      <div class="nav-brand">象棋游戏</div>
      <div class="nav-links">
        <a @click="navigateTo('/home')" class="active">首页</a>
        <a @click="navigateTo('/profile')">个人信息</a>
        <a @click="navigateTo('/rankings')">排行榜</a>
        <a @click="navigateTo('/settings')">设置</a>
      </div>
    </nav>
    <main class="main-content">
      <!-- 新增：返回按钮 -->
      <button @click="goBack" class="back-btn top-left-back-btn">返回</button>
      <h1>欢迎来到象棋游戏</h1>
      <div class="feature-cards">
        <div class="feature-card">
          <h2>人机对战</h2>
          <p>与AI进行对战，提升您的棋艺</p>
          <button class="action-btn" @click="startGame">开始游戏</button>
        </div>
        <div class="feature-card">
          <h2>在线对战</h2>
          <p>与全球玩家一较高下</p>
          <button class="action-btn" @click="startOnlineBattle">进入大厅</button>
        </div>
        <div class="feature-card">
          <h2>排行榜</h2>
          <p>查看您的排名和成就</p>
          <button class="action-btn" @click="navigateTo('/rankings')">查看排名</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-container {
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
  background-color: rgba(85, 85, 85, 0.5);
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
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(2px);
  color: rgba(0, 0, 0, 0.8);
  /* 新增：如果按钮放在这里，也需要相对定位 */
  position: relative;
}

h1 {
  /* 新增：为按钮留出空间 */
  margin-top: 3rem;
  margin-bottom: 2rem;
  color: rgba(0, 0, 0, 0.8);
  text-align: center;
}

.feature-cards {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-card {
  background-color: rgba(255, 255, 255, 0.15);
  padding: 1.5rem;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  backdrop-filter: blur(2px);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h2 {
  margin-bottom: 1rem;
  color: rgba(0, 0, 0, 0.8);
}

.feature-card p {
  margin-bottom: 1.5rem;
  color: rgba(0, 0, 0, 0.7);
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: rgba(175, 76, 147, 0.5);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: rgba(175, 76, 147, 0.7);
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