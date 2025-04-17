// 这是一个简单的象棋游戏引擎实现，包含棋盘初始化、棋子移动、悔棋等功能
// 该引擎使用 Vue 3 的 Composition API 和 TypeScript 编写，适用于 Vue 3 项目

import { ref, Ref, computed } from 'vue'
import { isPieceColor, isValidMove, isKingInCheck, hasLegalMoves } from './ChessRules'

// 棋盘中文名称接口
export type ChessPiece = string | null

export interface GameEngine {
  // 数据
  board: Ref<ChessPiece[][]>
  selectedPiece: Ref<[number, number] | null>
  isMyTurn: Ref<boolean>

  // 方法
  initBoard: () => void
  handlePieceClick: (row: number, col: number) => boolean // 返回是否移动成功
  handleBoardClick: (row: number, col: number) => boolean // 返回是否移动成功
  undoMove: (from: [number, number], to: [number, number], capturedPiece: ChessPiece) => void // 增加恢复吃子参数
}

// 创建游戏引擎实例
export function createGameEngine(): GameEngine {
  // 棋盘数据 - 9列 x 10行的二维数组
  const board = ref<ChessPiece[][]>(Array(10).fill(null).map(() => Array(9).fill(null)))
  // 当前选中的棋子坐标
  const selectedPiece = ref<[number, number] | null>(null)
  // 是否轮到我方走子 (假设红方先走)
  const isMyTurn = ref(true) // 初始设为红方回合

  // 初始化棋盘
  const initBoard = () => {
    // 创建9x10的空棋盘
    board.value = Array(10).fill(null).map(() => Array(9).fill(null))

    // 初始化红方棋子（底部）
    board.value[9] = ['车', '马', '相', '仕', '帅', '仕', '相', '马', '车']
    board.value[8] = Array(9).fill(null) // 第9行是空的
    board.value[7] = [null, '炮', null, null, null, null, null, '炮', null]
    board.value[6] = ['兵', null, '兵', null, '兵', null, '兵', null, '兵']

    // 初始化黑方棋子（顶部）
    board.value[0] = ['車', '馬', '象', '士', '将', '士', '象', '馬', '車']
    board.value[1] = Array(9).fill(null) // 第2行是空的
    board.value[2] = [null, '砲', null, null, null, null, null, '砲', null]
    board.value[3] = ['卒', null, '卒', null, '卒', null, '卒', null, '卒']

    // 重置选中和回合状态
    selectedPiece.value = null;
    isMyTurn.value = true; // 确保红方先手
  }

  // 处理棋子点击
  const handlePieceClick = (row: number, col: number): boolean => {
    const piece = board.value[row][col];
    const pieceColor = isPieceColor(piece);
    const currentTurnColor = isMyTurn.value ? 'red' : 'black';

    // 情况1: 未选中棋子，点击的是当前回合方的棋子 -> 选中
    if (!selectedPiece.value && piece && pieceColor === currentTurnColor) {
      selectedPiece.value = [row, col];
      return false; // 只是选中，不是移动
    }

    // 情况2: 已选中棋子
    if (selectedPiece.value) {
      const [fromRow, fromCol] = selectedPiece.value;
      const fromPiece = board.value[fromRow][fromCol];
      const fromPieceColor = isPieceColor(fromPiece); // 确定选中棋子的颜色

      // 2a: 点击的是同一个棋子 -> 取消选中
      if (fromRow === row && fromCol === col) {
        selectedPiece.value = null;
        return false;
      }

      // 2b: 点击的是另一个己方棋子 -> 切换选中
      if (piece && pieceColor === fromPieceColor) {
          selectedPiece.value = [row, col];
          return false; // 只是切换选中
      }

      // 2c: 点击空位或对方棋子 -> 尝试移动
      if (isValidMove(board.value, fromRow, fromCol, row, col)) {
        // 移动前，获取目标位置棋子（用于悔棋恢复）
        const targetPiece = board.value[row][col];

        // --- 模拟移动并检查自己是否被将军 ---
        board.value[row][col] = fromPiece; // 模拟移动
        board.value[fromRow][fromCol] = null;
        const kingInCheckAfterMove = isKingInCheck(board.value, fromPieceColor!); // 检查己方王
        // --- 撤销模拟 ---
        board.value[fromRow][fromCol] = fromPiece;
        board.value[row][col] = targetPiece;

        // 如果移动会导致己方被将军，则移动无效
        if (kingInCheckAfterMove) {
          console.log("移动非法: 会导致己方被将军");
          selectedPiece.value = null; // 取消选择
          return false; // 移动失败
        }

        // --- 移动合法，执行移动 ---
        board.value[row][col] = fromPiece;
        board.value[fromRow][fromCol] = null;
        selectedPiece.value = null; // 移动成功后取消选择

        // --- 检查是否将军或绝杀/困毙对方 ---
        const opponentColor = fromPieceColor === 'red' ? 'black' : 'red';
        if (isKingInCheck(board.value, opponentColor)) {
          if (!hasLegalMoves(board.value, opponentColor)) {
            // 绝杀!
            console.log(`绝杀! ${fromPieceColor} 获胜!`);
            alert(`绝杀! ${fromPieceColor === 'red' ? '红方' : '黑方'}获胜!`);
            // TODO: 实现游戏结束处理
          } else {
            // 只是普通将军
            console.log(`${opponentColor} 被将军!`);
            // TODO: 添加将军的视觉提示？
          }
        } else {
          // 对手没有被将军，检查是否困毙
          if (!hasLegalMoves(board.value, opponentColor)) {
            // 困毙!
            console.log(`困毙! ${fromPieceColor} 获胜!`);
            alert(`困毙! ${fromPieceColor === 'red' ? '红方' : '黑方'}获胜!`);
            // TODO: 实现游戏结束处理
          }
        }

        // 所有检查完成后才切换回合
        isMyTurn.value = !isMyTurn.value;
        return true; // 移动成功

      } else {
        // 移动规则不符，移动无效
        console.log("移动无效");
        selectedPiece.value = null; // 取消选择
        return false;
      }
    }

    // 情况3: 未选中棋子，点击空位或对方棋子 -> 无操作
    return false;
  }

  // 处理棋盘点击（用于移动棋子到空位）
  const handleBoardClick = (row: number, col: number): boolean => {
    // 必须先选中棋子
    if (selectedPiece.value) {
      // 直接调用 handlePieceClick 处理，它包含了所有移动逻辑
      return handlePieceClick(row, col);
    }
    return false; // 未选中棋子，点击棋盘无效
  }

  // 添加悔棋功能
  // 修改：增加 capturedPiece 参数
  const undoMove = (from: [number, number], to: [number, number], capturedPiece: ChessPiece) => {
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to

    // 检查目标位置（移动后的位置）是否有棋子
    const movedPiece = board.value[toRow][toCol];
    if (!movedPiece) {
        console.error("悔棋错误：目标位置没有棋子");
        return;
    }

    // 恢复棋子位置
    board.value[fromRow][fromCol] = movedPiece; // 把棋子移回原位
    board.value[toRow][toCol] = capturedPiece; // 恢复被吃的棋子（或null）

    // 切换回合 (悔棋后轮到对方)
    isMyTurn.value = !isMyTurn.value; // 切换回执行悔棋操作的玩家的回合
    selectedPiece.value = null; // 取消可能存在的选择状态
  }

  // 返回游戏引擎接口
  return {
    board,
    selectedPiece,
    isMyTurn,
    initBoard,
    handlePieceClick,
    handleBoardClick,
    undoMove
  }
}