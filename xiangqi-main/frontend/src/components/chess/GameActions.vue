<template>
    <div class="game-actions">
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="action-btn" @click="handleResign">认输</button>
        <button class="action-btn" @click="handleDraw">提和</button>
        <button class="action-btn" :disabled="!canUndo" @click="handleUndo">悔棋</button>
      </div>
  
      <!-- 认输确认弹窗 -->
      <div v-if="showResignConfirm" class="modal-overlay">
        <div class="modal-content">
          <h3>确认认输</h3>
          <p>您确定要认输吗？</p>
          <div class="modal-buttons">
            <button @click="confirmResign">确认</button>
            <button @click="cancelResign">取消</button>
          </div>
        </div>
      </div>
  
      <!-- 提和弹窗 -->
      <div v-if="showDrawRequest" class="modal-overlay">
        <div class="modal-content">
          <h3>{{ isDrawRequester ? '等待对方回应' : '对方请求和棋' }}</h3>
          <p v-if="!isDrawRequester">对方请求和棋，您是否同意？</p>
          <div class="modal-buttons" v-if="!isDrawRequester">
            <button @click="acceptDraw">同意</button>
            <button @click="rejectDraw">拒绝</button>
          </div>
        </div>
      </div>
  
      <!-- 悔棋弹窗 -->
      <div v-if="showUndoRequest" class="modal-overlay">
        <div class="modal-content">
          <h3>{{ isUndoRequester ? '等待对方回应' : '对方请求悔棋' }}</h3>
          <p v-if="!isUndoRequester">对方请求悔棋，您是否同意？</p>
          <div class="modal-buttons" v-if="!isUndoRequester">
            <button @click="acceptUndo">同意</button>
            <button @click="rejectUndo">拒绝</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  const props = defineProps<{
    isMyTurn: boolean
    canUndo: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'resign'): void
    (e: 'draw'): void
    (e: 'undo'): void
    (e: 'acceptDraw'): void
    (e: 'rejectDraw'): void
    (e: 'acceptUndo'): void
    (e: 'rejectUndo'): void
  }>()
  
  // 弹窗状态
  const showResignConfirm = ref(false)
  const showDrawRequest = ref(false)
  const showUndoRequest = ref(false)
  const isDrawRequester = ref(false)
  const isUndoRequester = ref(false)
  
  // 处理认输
  const handleResign = () => {
    showResignConfirm.value = true
  }
  
  const confirmResign = () => {
    emit('resign')
    showResignConfirm.value = false
  }
  
  const cancelResign = () => {
    showResignConfirm.value = false
  }
  
  // 处理提和
  const handleDraw = () => {
    showDrawRequest.value = true
    isDrawRequester.value = true
    emit('draw')
  }
  
  const acceptDraw = () => {
    emit('acceptDraw')
    showDrawRequest.value = false
  }
  
  const rejectDraw = () => {
    emit('rejectDraw')
    showDrawRequest.value = false
  }
  
  // 处理悔棋
  const handleUndo = () => {
    showUndoRequest.value = true
    isUndoRequester.value = true
    emit('undo')
  }
  
  const acceptUndo = () => {
    emit('acceptUndo')
    showUndoRequest.value = false
  }
  
  const rejectUndo = () => {
    emit('rejectUndo')
    showUndoRequest.value = false
  }
  
  // 暴露方法给父组件调用
  defineExpose({
    showDrawRequest,
    showUndoRequest,
    isDrawRequester,
    isUndoRequester
  })
  </script>
  
  <style scoped>
  .game-actions {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 100;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
  }
  
  .action-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(139, 69, 19, 0.6) 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    min-width: 80px;
  }
  
  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    text-align: center;
    min-width: 300px;
  }
  
  .modal-content h3 {
    color: #8B4513;
    margin-bottom: 15px;
  }
  
  .modal-content p {
    margin-bottom: 20px;
    color: #666;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
  
  .modal-buttons button {
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 80px;
  }
  
  .modal-buttons button:first-child {
    background: linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(139, 69, 19, 0.6) 100%);
    color: white;
  }
  
  .modal-buttons button:last-child {
    background: linear-gradient(135deg, rgba(200, 200, 200, 0.8) 0%, rgba(200, 200, 200, 0.6) 100%);
    color: #666;
  }
  
  .modal-buttons button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  </style> 