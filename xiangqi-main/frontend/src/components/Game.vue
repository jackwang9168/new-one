<template>
  <div class="game-container">
    <!-- 游戏模态框组件：显示游戏信息和匹配对手 -->
    <GameModals
      :show-game-info="showGameInfo"
      :show-matching="showMatching"
      :matching-time="matchingTime"
      :game-info="gameInfo"
      @close-game-info="closeGameInfo"
      @cancel-matching="cancelMatching"
    />

    <!-- 游戏对战界面 -->
    <div v-if="!showGameInfo && !showMatching" class="game-battle">
      <!-- 顶部导航栏 -->
      <nav class="navbar">
        <div class="nav-brand">象棋游戏</div>
        <div class="nav-links">
           <!-- 修改：将“返回首页”改为调用 goBack 函数的“返回” -->
          <a @click="goBack">返回</a>
        </div>
      </nav>

      <!-- 游戏主界面 -->
      <main class="battle-main">
        <!-- 对手信息 -->
        <div class="opponent-info" v-if="opponent">
          <div class="opponent-avatar">
            <img :src="opponent.avatar" alt="对手头像">
          </div>
          <div class="opponent-name">{{ opponent.name }}</div>
          <div class="time-info">
            <div class="total-time">
              总时间：{{ formatTime(opponentTotalTime) }}
            </div>
            <div class="step-time" v-if="!isMyTurn">
              步时：{{ formatTime(opponentStepTime) }}
            </div>
          </div>
        </div>

        <!-- 我方信息 -->
        <div class="player-info">
          <div class="player-avatar">
            <img :src="player.avatar" alt="我的头像">
          </div>
          <div class="player-name">{{ player.name }}</div>
          <div class="time-info">
            <div class="total-time">
              总时间：{{ formatTime(playerTotalTime) }}
            </div>
            <div class="step-time" v-if="isMyTurn">
              步时：{{ formatTime(playerStepTime) }}
            </div>
          </div>
        </div>

        <!-- 游戏操作按钮 -->
        <GameActions
          :is-my-turn="isMyTurn"
          :can-undo="canUndo"
          @resign="handleResign"
          @draw="handleDraw"
          @undo="handleUndo"
          @accept-draw="handleAcceptDraw"
          @reject-draw="handleRejectDraw"
          @accept-undo="handleAcceptUndo"
          @reject-undo="handleRejectUndo"
          ref="gameActionsRef"
        />

        <!-- 棋盘组件 -->
        <ChessBoard
          :board="board"
          :selected-piece="selectedPiece"
          :is-my-turn="isMyTurn"
          :player-color="playerColor"
          @piece-click="handlePieceClick"
          @board-click="handleBoardClick"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRefs, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ChessBoard from './chess/ChessBoard.vue'
import GameModals from './chess/GameModals.vue'
// 修改：导入 createGameEngine 和 ChessPiece 类型
import { createGameEngine, type ChessPiece } from './chess/GameEngine'
import { isPieceColor } from './chess/ChessRules'
import GameActions from './chess/GameActions.vue'

const router = useRouter() // 获取 router 实例
const route = useRoute()

// 初始化游戏引擎
const gameEngine = createGameEngine()
// 解构游戏引擎中的响应式数据
const { board, selectedPiece, isMyTurn } = toRefs(gameEngine)

// 玩家阵营状态
const playerColor = ref<'red' | 'black' | null>(null)

// 游戏状态
const showGameInfo = ref(true)
const showMatching = ref(false)
const matchingTime = ref(0)
let matchingTimer: number | null = null

// 对手信息 (使用更健壮的默认头像路径)
const opponent = ref({
  name: '对手昵称',
  avatar: '/default-avatar.png' // 确保这个路径有效或者使用相对路径 '../pictures/default.png' 等
})

// 我方信息 (使用更健壮的默认头像路径)
const player = ref({
  name: '我的昵称',
  avatar: '/default-avatar.png' // 确保这个路径有效或者使用相对路径 '../pictures/default.png' 等
})


// 计时器相关
const opponentTotalTime = ref(0) // 对手总时间（秒）
const opponentStepTime = ref(0) // 对手步时（秒）
const playerTotalTime = ref(0) // 我方总时间（秒）
const playerStepTime = ref(0) // 我方步时（秒）
let totalTimer: number | null = null
let stepTimer: number | null = null

// 游戏操作相关状态
const gameActionsRef = ref()
const canUndo = ref(false)
// 修改：这里使用了 ChessPiece 类型，确保它已被导入
const lastMove = ref<{ from: [number, number], to: [number, number], piece: ChessPiece } | null>(null) // 增加 piece 用于悔棋恢复

// 新增：返回上一页的函数
const goBack = () => {
  // 在离开游戏前可能需要清理计时器或发送离开消息
  if (totalTimer) clearInterval(totalTimer);
  if (stepTimer) clearInterval(stepTimer);
  if (matchingTimer) clearInterval(matchingTimer);
  // TODO: 如果是在线对战，发送离开对局的消息给服务器

  router.back(); // 执行返回操作
}

// 格式化时间显示
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 开始计时器
const startTimers = () => {
  // 根据游戏模式设置初始时间
  const mode = route.query.mode
  let initialTotalTime = 10 * 60; // 默认10分钟
  let initialStepTime = 90; // 默认90秒
  let initialFirstMoveTime = 30; // 默认前3步30秒

  switch (mode) {
    case '5':
      initialTotalTime = 5 * 60;
      initialStepTime = 60;
      break;
    case '10':
      initialTotalTime = 10 * 60;
      initialStepTime = 90;
      break;
    case '20':
      initialTotalTime = 20 * 60;
      initialStepTime = 60;
      break;
  }

  opponentTotalTime.value = initialTotalTime;
  playerTotalTime.value = initialTotalTime;
  opponentStepTime.value = initialStepTime; // 初始步时
  playerStepTime.value = initialStepTime; // 初始步时

  // 清理旧计时器（如果存在）
  if (totalTimer) clearInterval(totalTimer);
  if (stepTimer) clearInterval(stepTimer);


  // 总时间计时器
  totalTimer = window.setInterval(() => {
    if (isMyTurn.value && playerTotalTime.value > 0) {
      playerTotalTime.value--;
      if (playerTotalTime.value <= 0) handleTimeout(); // 处理己方超时
    } else if (!isMyTurn.value && opponentTotalTime.value > 0) {
      opponentTotalTime.value--;
       if (opponentTotalTime.value <= 0) handleTimeout(); // 处理对方超时（理论上服务器处理）
    }
  }, 1000);

  // 步时计时器
  stepTimer = window.setInterval(() => {
    if (isMyTurn.value && playerStepTime.value > 0) {
      playerStepTime.value--;
      if (playerStepTime.value <= 0) handleTimeout(); // 处理己方步时超时
    } else if (!isMyTurn.value && opponentStepTime.value > 0) {
      opponentStepTime.value--;
      // 对方步时超时通常由服务器判断并通知
    }
  }, 1000);
}

// 重置步时
const resetStepTime = () => {
   const mode = route.query.mode;
   let stepTime = 90; // 默认90秒
   switch (mode) {
      case '5':
      case '20':
         stepTime = 60;
         break;
      case '10':
      default:
         stepTime = 90;
         break;
   }
   // 重置当前回合方的步时
   if (isMyTurn.value) {
      playerStepTime.value = stepTime;
   } else {
      opponentStepTime.value = stepTime;
   }
}


// 监听回合变化
watch(isMyTurn, (newValue, oldValue) => {
  // 只有在回合实际发生变化时才重置步时和处理悔棋状态
  if (newValue !== oldValue) {
     resetStepTime(); // 重置新回合方的步时
     // 回合切换后，通常不能立即悔棋（除非对方同意）
     canUndo.value = false;
     lastMove.value = null; // 清除上一步记录，避免错误悔棋
  }
});

// 处理超时
const handleTimeout = () => {
  clearInterval(totalTimer!);
  clearInterval(stepTimer!);
  // 判断是谁超时
  const winner = isMyTurn.value ? '黑方' : '红方'; // 超时方输
  alert(`时间到！${winner}获胜！`);
  // TODO: 结束游戏逻辑，禁用棋盘等
}


// 组件卸载时清理计时器
onUnmounted(() => {
  if (totalTimer) clearInterval(totalTimer)
  if (stepTimer) clearInterval(stepTimer)
  if (matchingTimer) clearInterval(matchingTimer)
  // TODO: 发送离开对局的消息
})

// 游戏说明内容
const gameInfo = computed(() => {
  const mode = route.query.mode
  let totalTimeDesc = '总时间：10分钟，步时90秒';
  let firstMovesDesc = '前3步30秒'; // 这个逻辑目前计时器未实现

  switch (mode) {
    case '5':
      totalTimeDesc = '总时间：5分钟，步时60秒';
      break;
    case '10':
      totalTimeDesc = '总时间：10分钟，步时90秒';
      break;
    case '20':
      totalTimeDesc = '总时间：20分钟，步时60秒';
      break;
  }
  return {
    title: '本场说明',
    totalTime: totalTimeDesc,
    firstMoves: firstMovesDesc
  }
})

// 关闭游戏说明提示框并开始匹配
const closeGameInfo = () => {
  showGameInfo.value = false
  startMatching()
}

// 开始匹配
const startMatching = () => {
  showMatching.value = true
  matchingTime.value = 0
  matchingTimer = window.setInterval(() => {
    matchingTime.value++
  }, 1000)

  // 模拟匹配过程，实际项目中应该通过WebSocket与服务器通信
  // TODO: 替换为 WebSocket 连接和匹配逻辑
  console.log("开始匹配...");
  setTimeout(() => {
    if (!showMatching.value) return; // 如果中途取消了匹配

    if (matchingTimer) {
      clearInterval(matchingTimer)
      matchingTimer = null; // 清理计时器ID
    }
    showMatching.value = false
    console.log("匹配成功！");

    // 模拟从服务器获取玩家阵营和对手信息
    // TODO: 从服务器获取真实数据
    assignPlayerColor();
    opponent.value = { name: '模拟对手', avatar: '/default-avatar.png' }; // 示例对手信息
    player.value = { name: '模拟玩家', avatar: '/default-avatar.png' }; // 示例玩家信息

    // 初始化棋盘
    gameEngine.initBoard()

    // 开始计时器
    startTimers()
  }, 3000) // 模拟3秒匹配时间
}

// 分配玩家阵营
const assignPlayerColor = () => {
  // TODO: 替换为实际的API调用或WebSocket消息
  // 这里模拟随机分配阵营
  playerColor.value = Math.random() > 0.5 ? 'red' : 'black'
  console.log(`玩家被分配为: ${playerColor.value === 'red' ? '红方' : '黑方'}`)

  // 根据分配的阵营设置初始回合
  isMyTurn.value = playerColor.value === 'red'
}

// 取消匹配
const cancelMatching = () => {
  if (matchingTimer) {
    clearInterval(matchingTimer);
    matchingTimer = null;
  }
  showMatching.value = false;
  console.log("取消匹配");
  // TODO: 通知服务器取消匹配（如果需要）
  router.push('/game-lobby'); // 返回大厅
}

// --- 游戏操作处理 ---

// 处理认输
const handleResign = () => {
  // gameActionsRef.value?.showResignConfirm?.(); // 通过 ref 调用子组件方法显示确认框
  // 简化处理：直接确认
   if (confirm("您确定要认输吗？")) {
       console.log('玩家认输');
       // TODO: 发送认输请求到服务器
       // TODO: 游戏结束逻辑（例如显示结果，禁用棋盘）
       clearInterval(totalTimer!);
       clearInterval(stepTimer!);
   }
}

// 处理提和
const handleDraw = () => {
  console.log('玩家请求和棋');
  // TODO: 发送提和请求到服务器
  // 模拟对方响应（实际应由服务器转发）
  // gameActionsRef.value?.showDrawRequest(true); // 自己是请求方
}

const handleAcceptDraw = () => {
  console.log('同意和棋');
  // TODO: 发送同意和棋到服务器
  // TODO: 游戏结束逻辑（平局）
  clearInterval(totalTimer!);
  clearInterval(stepTimer!);
}

const handleRejectDraw = () => {
  console.log('拒绝和棋');
  // TODO: 发送拒绝和棋到服务器
}

// 处理悔棋
const handleUndo = () => {
  if (!canUndo.value || !lastMove.value) {
      console.log("不能悔棋");
      return;
   }
  console.log('玩家请求悔棋');
  // TODO: 发送悔棋请求到服务器
  // 模拟对方响应
  // gameActionsRef.value?.showUndoRequest(true); // 自己是请求方
  // 暂时直接同意悔棋以测试
  if (confirm("模拟对方：同意悔棋吗？")) {
      handleAcceptUndo();
  } else {
      handleRejectUndo();
  }
}

const handleAcceptUndo = () => {
  console.log('同意悔棋');
   if (lastMove.value) {
       // TODO: 发送同意悔棋到服务器（如果需要确认）
       gameEngine.undoMove(lastMove.value.from, lastMove.value.to, lastMove.value.piece); // 使用引擎的悔棋
       // 悔棋后，轮到对方走，所以 isMyTurn 应该变为 false
       // isMyTurn.value = false; // 引擎内部已经处理了回合切换
       resetStepTime(); // 重置对方的步时
       lastMove.value = null; // 清除悔棋记录
       canUndo.value = false; // 悔棋后不能立即再悔棋
   }
}

const handleRejectUndo = () => {
  console.log('拒绝悔棋');
  // TODO: 发送拒绝悔棋到服务器
}

// --- 棋盘交互处理 ---

// 修改棋子点击处理函数
const handlePieceClick = (row: number, col: number) => {
  // 检查是否是玩家的回合
  if (!isMyTurn.value) {
    console.log('不是你的回合');
    return;
  }

  // 获取点击的棋子和颜色
  const piece = board.value[row][col];
  const pieceColor = isPieceColor(piece);

  // 情况1：之前未选中棋子，现在点击己方棋子 -> 选中
  if (!selectedPiece.value && piece && pieceColor === playerColor.value) {
    gameEngine.handlePieceClick(row, col); // 引擎处理选中逻辑
    return;
  }

  // 情况2：之前已选中棋子
  if (selectedPiece.value) {
    const [fromRow, fromCol] = selectedPiece.value;
    const fromPiece = board.value[fromRow][fromCol]; // 获取选中的棋子

    // 点击己方其他棋子 -> 切换选中
    if (piece && pieceColor === playerColor.value) {
        gameEngine.handlePieceClick(row, col); // 引擎处理切换选中
        return;
    }

    // 点击空位或对方棋子 -> 尝试移动
    const targetPiece = board.value[row][col]; // 目标位置的棋子（可能为 null）
    const isValid = gameEngine.handlePieceClick(row, col); // 引擎处理移动尝试，返回是否有效

    if (isValid) {
        // 如果移动有效，记录这一步，以便悔棋
        lastMove.value = {
            from: [fromRow, fromCol],
            to: [row, col],
            piece: targetPiece // 记录被吃的棋子或null
        };
        canUndo.value = true; // 移动成功后可以悔棋
    }
    return;
  }

   // 其他情况（未选中时点击空位或对方棋子）-> 不做任何事
   console.log("无效点击");
}

// 修改棋盘点击处理函数（主要用于移动到空位）
const handleBoardClick = (row: number, col: number) => {
  // 检查是否是玩家的回合
  if (!isMyTurn.value) {
    console.log('不是你的回合');
    return;
  }

  // 必须先选中了棋子才能移动到空位
  if (selectedPiece.value) {
    const [fromRow, fromCol] = selectedPiece.value;
    const fromPiece = board.value[fromRow][fromCol];

    // 调用引擎处理移动到空位
    const isValid = gameEngine.handleBoardClick(row, col); // 引擎处理移动到空位

    if (isValid) {
       // 如果移动有效，记录这一步，以便悔棋
       lastMove.value = {
          from: [fromRow, fromCol],
          to: [row, col],
          piece: null // 移动到空位，没有吃子
       };
       canUndo.value = true; // 移动成功后可以悔棋
    }
  } else {
      console.log("请先选择要移动的棋子");
  }
}

</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  background-image: url('../pictures/2.webp');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 游戏对战界面样式 */
.game-battle {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.battle-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  position: relative; /* 为绝对定位的子元素提供基准 */
}

/* 导航样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: rgba(139, 69, 19, 0.8);
  color: white;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.2);
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.opponent-info {
  position: absolute;
  /* 调整位置以适应棋盘 */
  top: 80px; /* Navbar下方 */
  left: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  padding: 15px; /* 稍微减小内边距 */
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 150px; /* 调整最小宽度 */
  z-index: 5; /* 确保在棋盘之上 */
}

.opponent-avatar {
  width: 60px; /* 减小头像尺寸 */
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 10px; /* 调整边距 */
  border: 3px solid rgba(139, 69, 19, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.opponent-avatar:hover {
  transform: scale(1.05);
}

.opponent-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.opponent-name {
  font-size: 15px; /* 减小字体 */
  font-weight: bold;
  margin-bottom: 10px; /* 调整边距 */
  color: #8B4513;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.time-info {
  font-size: 13px; /* 减小字体 */
  background: rgba(139, 69, 19, 0.1);
  padding: 8px; /* 减小内边距 */
  border-radius: 8px;
  margin-top: 5px;
}

.total-time {
  margin-bottom: 6px; /* 调整边距 */
  color: #666;
  font-weight: 500;
}

.step-time {
  color: #ff4d4f;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.player-info {
  position: absolute;
  /* 调整位置以适应棋盘 */
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  padding: 15px; /* 稍微减小内边距 */
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 150px; /* 调整最小宽度 */
  z-index: 5; /* 确保在棋盘之上 */
}

.player-avatar {
  width: 60px; /* 减小头像尺寸 */
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 10px; /* 调整边距 */
  border: 3px solid rgba(139, 69, 19, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.player-avatar:hover {
  transform: scale(1.05);
}

.player-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-name {
  font-size: 15px; /* 减小字体 */
  font-weight: bold;
  margin-bottom: 10px; /* 调整边距 */
  color: #8B4513;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* GameActions 组件的位置调整 */
/* GameActions 现在通过 props 传递给 Game.vue，由 Game.vue 负责定位 */
/* 在 .battle-main 中添加对 GameActions 的样式 */
.battle-main > :deep(.game-actions) { /* 使用 :deep() 选择子组件根元素 */
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 100; /* 确保操作按钮在最上层 */
}
</style>