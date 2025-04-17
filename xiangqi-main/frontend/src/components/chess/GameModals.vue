<template>
  <!-- 游戏说明提示框 -->
  <div v-if="showGameInfo" class="game-info-modal">
    <div class="game-info-content">
      <div class="info-header">
        <h2>{{ gameInfo.title }}</h2>
        <div class="divider"></div>
      </div>
      <div class="info-body">
        <div class="info-item">
          <span class="info-icon">⏱️</span>
          <p>{{ gameInfo.totalTime }}</p>
        </div>
        <div class="info-item">
          <span class="info-icon">⚡</span>
          <p>{{ gameInfo.firstMoves }}</p>
        </div>
      </div>
      <button class="confirm-btn" @click="onCloseGameInfo">开始游戏</button>
    </div>
  </div>

  <!-- 匹配对手提示框 -->
  <div v-if="showMatching" class="matching-modal">
    <div class="matching-content">
      <div class="matching-header">
        <h2>正在匹配对手</h2>
        <div class="matching-time">已等待: {{ formatTime(matchingTime) }}</div>
      </div>
      <div class="matching-animation">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <button class="cancel-btn" @click="onCancelMatching">取消匹配</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

// 从父组件接收数据
const props = defineProps<{
  showGameInfo: boolean,
  showMatching: boolean,
  matchingTime: number,
  gameInfo: {
    title: string,
    totalTime: string,
    firstMoves: string
  }
}>()

// 向父组件发送事件
const emit = defineEmits(['close-game-info', 'cancel-matching'])

// 处理关闭游戏说明
const onCloseGameInfo = () => {
  emit('close-game-info')
}

// 处理取消匹配
const onCancelMatching = () => {
  emit('cancel-matching')
}

// 格式化时间
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
/* 游戏说明提示框样式 */
.game-info-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.game-info-content {
  background: linear-gradient(135deg, #FFEBCD 0%, #FFF5EE 100%);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 320px;
  border: 2px solid rgba(175, 76, 147, 0.3);
  transform: translateY(0);
  animation: floatIn 0.5s ease-out;
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-header {
  margin-bottom: 1.5rem;
}

.info-header h2 {
  color: #8B4513;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.divider {
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8B4513, transparent);
  margin: 0 auto;
}

.info-body {
  margin: 1.5rem 0;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.info-item:hover {
  transform: translateX(5px);
}

.info-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.info-item p {
  color: #8B4513;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.confirm-btn {
  margin-top: 1.5rem;
  padding: 0.8rem 2.5rem;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
  background: linear-gradient(135deg, #A0522D 0%, #8B4513 100%);
}

.confirm-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(139, 69, 19, 0.3);
}

/* 匹配提示框样式 */
.matching-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.matching-content {
  background: linear-gradient(135deg, #FFEBCD 0%, #FFF5EE 100%);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 320px;
  border: 2px solid rgba(175, 76, 147, 0.3);
  transform: translateY(0);
  animation: floatIn 0.5s ease-out;
}

.matching-header {
  margin-bottom: 2rem;
}

.matching-header h2 {
  color: #8B4513;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.matching-time {
  color: #8B4513;
  font-size: 1.2rem;
  font-weight: 500;
}

.matching-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
}

.dot {
  width: 12px;
  height: 12px;
  background: #8B4513;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  }
  40% { 
    transform: scale(1);
  }
}

.cancel-btn {
  margin-top: 1.5rem;
  padding: 0.8rem 2.5rem;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
  background: linear-gradient(135deg, #A0522D 0%, #8B4513 100%);
}

.cancel-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(139, 69, 19, 0.3);
}
</style> 