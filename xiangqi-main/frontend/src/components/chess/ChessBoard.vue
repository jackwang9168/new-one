<template>
  <div class="chess-area">
    <!-- 棋盘外层容器，用于边框和内边距 -->
    <div class="chessboard-container">
      <!-- 棋盘内层区域，用于网格、棋子等 -->
      <div class="chess-board">
        <!-- 水平线 -->
        <div v-for="i in 10" :key="`h-${i}`" 
             class="line horizontal" 
             :style="{ top: `${(i - 1) * 50}px` }">
        </div>
        <!-- 垂直线 -->
        <div v-for="i in 9" :key="`v-${i}`" 
             class="line vertical" 
             :style="{ left: `${(i - 1) * 50}px` }">
             <!-- 河流部分隐藏垂直线段 -->
             <div v-if="i > 1 && i < 9" class="river-segment-hide"></div>
        </div>

        <!-- 九宫格线 -->
        <div class="palace-lines">
          <!-- 黑方九宫 -->
          <div class="line palace-diag" style="top: 0px; left: 150px; width: 141.4px; transform: rotate(45deg); transform-origin: top left;"></div>
          <div class="line palace-diag" style="top: 0px; left: 250px; width: 141.4px; transform: rotate(135deg); transform-origin: top left;"></div>
           <!-- 红方九宫 -->
          <div class="line palace-diag" style="top: 350px; left: 150px; width: 141.4px; transform: rotate(45deg); transform-origin: top left;"></div>
          <div class="line palace-diag" style="top: 350px; left: 250px; width: 141.4px; transform: rotate(135deg); transform-origin: top left;"></div>
        </div>

        <!-- 炮兵位置标记 -->
        <div class="marker-layer">
          <div v-for="markerPos in markerPositions" 
               :key="`marker-${markerPos[0]}-${markerPos[1]}`"
               class="marker"
               :style="{ top: `${markerPos[0] * 50}px`, left: `${markerPos[1] * 50}px` }">
          </div>
        </div>

        <!-- 楚河汉界文字 -->
        <div class="river-text-container">
          <div class="river-text chu">楚 河</div>
          <div class="river-text han">漢 界</div>
        </div>

        <!-- 棋子层 -->
        <div class="pieces-layer">
          <div v-for="(row, rowIndex) in 10" :key="`piece-row-${rowIndex}`">
            <div v-for="(col, colIndex) in 9" :key="`piece-${rowIndex}-${colIndex}`">
              <div v-if="getDisplayPiece(rowIndex, colIndex)" 
                   class="piece"
                   :class="{
                     'selected': getDisplaySelectedPiece && getDisplaySelectedPiece[0] === rowIndex && getDisplaySelectedPiece[1] === colIndex,
                     'red': isPieceColor(getDisplayPiece(rowIndex, colIndex)) === 'red',
                     'black': isPieceColor(getDisplayPiece(rowIndex, colIndex)) === 'black'
                   }"
                   :style="{
                     top: `${rowIndex * 50}px`, 
                     left: `${colIndex * 50}px` 
                   }"
                   @click.stop="handlePieceClick(rowIndex, colIndex)">
                {{ getDisplayPiece(rowIndex, colIndex) }}
              </div>
            </div>
          </div>
        </div>

         <!-- 点击处理层 -->
         <div class="click-layer">
            <div v-for="rowIndex in 10" :key="`click-row-${rowIndex}`" style="display: flex;">
               <div v-for="colIndex in 9" :key="`click-cell-${rowIndex}-${colIndex}`"
                    class="click-point"
                    :style="{
                       top: `${(rowIndex - 1) * 50}px`,
                       left: `${(colIndex - 1) * 50}px`
                    }"
                    @click="handleBoardClick(rowIndex - 1, colIndex - 1)">
               </div>
            </div>
         </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'
import { isPieceColor } from './ChessRules'
import { ChessPiece } from './GameEngine'
import { Ref } from 'vue'

// 从父组件接收数据
const props = defineProps<{
  board: ChessPiece[][],
  selectedPiece: [number, number] | null,
  isMyTurn: boolean,
  playerColor: 'red' | 'black' | null
}>()

// 向父组件发送事件
const emit = defineEmits(['piece-click', 'board-click'])

// 棋盘上炮和兵的标记位置
const markerPositions = computed(() => {
  if (props.playerColor === 'red') {
    return [
      // 炮位置
      [2, 1], [2, 7], // 黑方炮
      [7, 1], [7, 7], // 红方炮
      // 兵/卒位置
      [3, 0], [3, 2], [3, 4], [3, 6], [3, 8], // 黑方卒
      [6, 0], [6, 2], [6, 4], [6, 6], [6, 8]  // 红方兵
    ]
  } else if (props.playerColor === 'black') {
    return [
      // 炮位置
      [7, 1], [7, 7], // 红方炮
      [2, 1], [2, 7], // 黑方炮
      // 兵/卒位置
      [6, 0], [6, 2], [6, 4], [6, 6], [6, 8], // 红方兵
      [3, 0], [3, 2], [3, 4], [3, 6], [3, 8]  // 黑方卒
    ]
  }
  return []
})

// 坐标转换函数
const convertCoordinates = (row: number, col: number) => {
  if (props.playerColor === 'black') {
    return [9 - row, 8 - col]
  }
  return [row, col]
}

// 处理棋子点击
const handlePieceClick = (row: number, col: number) => {
  const [adjustedRow, adjustedCol] = convertCoordinates(row, col)
  emit('piece-click', adjustedRow, adjustedCol)
}

// 处理棋盘点击
const handleBoardClick = (row: number, col: number) => {
  const [adjustedRow, adjustedCol] = convertCoordinates(row, col)
  emit('board-click', adjustedRow, adjustedCol)
}

// 获取显示用的棋子
const getDisplayPiece = (row: number, col: number) => {
  if (!props.board) return null
  const [adjustedRow, adjustedCol] = convertCoordinates(row, col)
  return props.board[adjustedRow][adjustedCol]
}

// 获取显示用的选中棋子位置
const getDisplaySelectedPiece = computed(() => {
  if (!props.selectedPiece) return null
  const [row, col] = props.selectedPiece
  return convertCoordinates(row, col)
})
</script>

<style scoped>
/* 棋盘区域 */
.chess-area {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* 棋盘外层容器 */
.chessboard-container {
  padding: 20px;
  background-color: #f3e5ca;
  border: 3px solid black;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: inline-block;
}

/* 棋盘内层区域 */
.chess-board {
  width: 400px;
  height: 450px;
  position: relative;
}

/* 线条样式 */
.line {
  background-color: black;
  position: absolute;
  z-index: 1;
}

.line.horizontal {
  width: 100%; 
  height: 1px;
  left: 0;
}

.line.vertical {
  height: 100%; 
  width: 1px;
  top: 0;
  display: flex;
  flex-direction: column;
}

/* 河流部分隐藏垂直线 */
.river-segment-hide {
  height: 50px;
  margin-top: 200px;
  background-color: #f3e5ca;
  width: 100%; 
  z-index: 2; 
}

/* 九宫格线 */
.palace-lines {
  position: absolute;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  pointer-events: none; 
  z-index: 1; 
}

.line.palace-diag {
  position: absolute;
  height: 1px; 
  background-color: black;
}

/* 标记层 */
.marker-layer {
  position: absolute;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 单个标记 */
.marker {
  position: absolute;
  width: 10px;
  height: 10px;
  transform: translate(-50%, -50%); 
}

/* 使用伪元素创建标记线 */
.marker::before,
.marker::after {
  content: '';
  position: absolute;
  background-color: black;
}

/* 标记的垂直线 */
.marker::before {
  width: 1px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}

/* 标记的水平线 */
.marker::after {
  height: 1px;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

/* 调整边缘标记（L形） */
.marker[style*="left: 0px"]::after {
  width: 50%; 
  left: 50%;
}
.marker[style*="left: 400px"]::after {
  width: 50%; 
  right: 50%;
  left: auto;
}

/* 楚河汉界文字 */
.river-text-container {
  position: absolute;
  top: 200px; 
  left: 0; 
  width: 100%;
  height: 50px; 
  display: flex;
  padding: 0 50px; 
  box-sizing: border-box;
  justify-content: space-between; 
  align-items: center;
  pointer-events: none; 
  z-index: 3; 
}

.river-text {
  font-size: 28px;
  color: black;
  font-family: 'KaiTi', 'SimSun', serif;
  font-weight: bold;
}

/* 棋子层 */
.pieces-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5; 
  pointer-events: none; 
}

/* 棋子样式 */
.piece {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  background: radial-gradient(circle, #fff, #eee);
  border: 2px solid;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255,255,255,0.5);
  transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;
  transform: translate(-50%, -50%);
  pointer-events: all;
  z-index: 6;
}

.piece.red {
  color: #c00;
  border-color: #a00;
}

.piece.black {
  color: #000;
  border-color: #333;
}

.piece.selected {
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.9), 0 3px 5px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255,255,255,0.5);
  transform: translate(-50%, -50%) scale(1.08);
  z-index: 7;
}

/* 点击处理层 */
.click-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4; 
}

.click-point {
  position: absolute;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 50%; 
  transform: translate(-50%, -50%);
}
</style> 