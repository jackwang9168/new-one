// 判断棋子颜色
export const isPieceColor = (piece: string | null): 'red' | 'black' | null => {
  if (!piece) return null
  const redPieces = ['帅', '仕', '相', '马', '车', '炮', '兵']
  const blackPieces = ['将', '士', '象', '馬', '車', '砲', '卒']
  return redPieces.includes(piece) ? 'red' : blackPieces.includes(piece) ? 'black' : null
}

// 帮助函数用于查找将/帅的位置
export const findKingPosition = (board: (string | null)[][], kingColor: 'red' | 'black'): [number, number] | null => {
  const kingPiece = kingColor === 'red' ? '帅' : '将';
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === kingPiece) {
        return [r, c];
      }
    }
  }
  return null; // 在有效的游戏状态下不应该发生
};

// 将/帅移动规则
export const isValidKingMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, color: 'red' | 'black'): boolean => {
  // 检查是否在九宫格内
  const isInPalace = (row: number, col: number) => {
    if (color === 'red') {
      return row >= 7 && row <= 9 && col >= 3 && col <= 5
    } else {
      return row >= 0 && row <= 2 && col >= 3 && col <= 5
    }
  }

  if (!isInPalace(toRow, toCol)) return false

  // 只能移动一格
  const rowDiff = Math.abs(toRow - fromRow)
  const colDiff = Math.abs(toCol - fromCol)
  if (rowDiff + colDiff !== 1) return false

  return true
}

// 仕/士移动规则
export const isValidAdvisorMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, color: 'red' | 'black'): boolean => {
  // 检查是否在九宫格内
  const isInPalace = (row: number, col: number) => {
    if (color === 'red') {
      return row >= 7 && row <= 9 && col >= 3 && col <= 5
    } else {
      return row >= 0 && row <= 2 && col >= 3 && col <= 5
    }
  }

  if (!isInPalace(toRow, toCol)) return false

  // 只能斜着走一格
  const rowDiff = Math.abs(toRow - fromRow)
  const colDiff = Math.abs(toCol - fromCol)
  if (rowDiff !== 1 || colDiff !== 1) return false

  return true
}

// 相/象移动规则
export const isValidElephantMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, color: 'red' | 'black', board: (string | null)[][]): boolean => {
  // 检查是否在己方河界内
  const isInOwnTerritory = (row: number) => {
    return color === 'red' ? row >= 5 : row <= 4
  }

  if (!isInOwnTerritory(toRow)) return false

  // 检查是否走田字
  const rowDiff = Math.abs(toRow - fromRow)
  const colDiff = Math.abs(toCol - fromCol)
  if (rowDiff !== 2 || colDiff !== 2) return false

  // 检查象眼是否被塞住
  const eyeRow = (fromRow + toRow) / 2
  const eyeCol = (fromCol + toCol) / 2
  if (board[eyeRow][eyeCol]) return false

  return true
}

// 马移动规则
export const isValidHorseMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, board: (string | null)[][]): boolean => {
  const rowDiff = Math.abs(toRow - fromRow)
  const colDiff = Math.abs(toCol - fromCol)

  // 检查是否走日字
  if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
    return false
  }

  // 检查马腿是否被塞住
  if (rowDiff === 2) {
    const legRow = fromRow + (toRow > fromRow ? 1 : -1)
    if (board[legRow][fromCol]) return false
  } else {
    const legCol = fromCol + (toCol > fromCol ? 1 : -1)
    if (board[fromRow][legCol]) return false
  }

  return true
}

// 车移动规则
export const isValidRookMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, board: (string | null)[][]): boolean => {
  // 检查是否在同一行或同一列
  if (fromRow !== toRow && fromCol !== toCol) return false

  // 检查路径上是否有其他棋子
  if (fromRow === toRow) {
    const start = Math.min(fromCol, toCol)
    const end = Math.max(fromCol, toCol)
    for (let col = start + 1; col < end; col++) {
      if (board[fromRow][col]) return false
    }
  } else {
    const start = Math.min(fromRow, toRow)
    const end = Math.max(fromRow, toRow)
    for (let row = start + 1; row < end; row++) {
      if (board[row][fromCol]) return false
    }
  }

  return true
}

// 炮移动规则
export const isValidCannonMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, board: (string | null)[][]): boolean => {
  // 检查是否在同一行或同一列
  if (fromRow !== toRow && fromCol !== toCol) return false

  let piecesInPath = 0

  // 检查路径上的棋子数量
  if (fromRow === toRow) {
    const start = Math.min(fromCol, toCol)
    const end = Math.max(fromCol, toCol)
    for (let col = start + 1; col < end; col++) {
      if (board[fromRow][col]) piecesInPath++
    }
  } else {
    const start = Math.min(fromRow, toRow)
    const end = Math.max(fromRow, toRow)
    for (let row = start + 1; row < end; row++) {
      if (board[row][fromCol]) piecesInPath++
    }
  }

  // 如果目标位置有棋子，必须有一个棋子作为炮架
  if (board[toRow][toCol]) {
    return piecesInPath === 1
  }
  // 如果目标位置没有棋子，路径上不能有棋子
  return piecesInPath === 0
}

// 兵/卒移动规则
export const isValidPawnMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, color: 'red' | 'black'): boolean => {
  const rowDiff = toRow - fromRow
  const colDiff = Math.abs(toCol - fromCol)

  // 检查是否过河
  const isCrossedRiver = color === 'red' ? fromRow <= 4 : fromRow >= 5

  // 未过河时只能向前走
  if (!isCrossedRiver) {
    if (color === 'red') {
      if (rowDiff !== -1 || colDiff !== 0) return false
    } else {
      if (rowDiff !== 1 || colDiff !== 0) return false
    }
  } else {
    // 过河后可以左右移动
    if (color === 'red') {
      if (rowDiff !== -1 && rowDiff !== 0) return false
    } else {
      if (rowDiff !== 1 && rowDiff !== 0) return false
    }
    if (colDiff > 1) return false
  }

  return true
}

// 检查某个位置是否被对方攻击
export const isSquareAttacked = (board: (string | null)[][], targetRow: number, targetCol: number, attackerColor: 'red' | 'black'): boolean => {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && isPieceColor(piece) === attackerColor) {
        // 检查该攻击方棋子（位于r,c）是否可以攻击目标位置（targetRow,targetCol）

        if (piece === '炮' || piece === '砲') {
            // 炮的攻击逻辑：必须在同一条线上且中间恰好有一个棋子作为炮架
            if (r !== targetRow && c !== targetCol) continue; // 必须在同一行或同一列

            let piecesInPath = 0;
            if (r === targetRow) { // 同一行
                const start = Math.min(c, targetCol);
                const end = Math.max(c, targetCol);
                for (let col = start + 1; col < end; col++) {
                    if (board[r][col]) piecesInPath++;
                }
            } else { // 同一列
                const start = Math.min(r, targetRow);
                const end = Math.max(r, targetRow);
                for (let row = start + 1; row < end; row++) {
                    if (board[row][c]) piecesInPath++;
                }
            }
            // 炮攻击需要恰好一个中间棋子
            if (piecesInPath === 1) return true;

        } else if (piece === '兵' || piece === '卒') {
             // 兵/卒的攻击逻辑：只能向前斜着攻击一步
             const direction = attackerColor === 'red' ? -1 : 1; // 红方向上移动(-1)，黑方向下移动(+1)
             if (targetRow === r + direction && Math.abs(targetCol - c) === 1) {
                 return true;
             }

        } else {
            // 对于其他棋子，检查它们是否可以移动到目标格子
            // 假设目标格子是空的（检查攻击向量）
            
            const tempTargetPiece = board[targetRow][targetCol]; // 保存目标格子状态
            // 仅当目标格子不是当前检查的棋子位置时，才临时视为空格子
            let boardCopy = [...board.map(row => [...row])]; // 深拷贝棋盘避免修改原棋盘
            
            if (!(r === targetRow && c === targetCol)) {
              boardCopy[targetRow][targetCol] = null; 
            }
            
            let canAttack = false;
            // 使用特定的移动验证函数
            if (piece === '帅' || piece === '将') canAttack = isValidKingMove(r, c, targetRow, targetCol, attackerColor);
            else if (piece === '仕' || piece === '士') canAttack = isValidAdvisorMove(r, c, targetRow, targetCol, attackerColor);
            else if (piece === '相' || piece === '象') canAttack = isValidElephantMove(r, c, targetRow, targetCol, attackerColor, boardCopy);
            else if (piece === '马' || piece === '馬') canAttack = isValidHorseMove(r, c, targetRow, targetCol, boardCopy);
            else if (piece === '车' || piece === '車') canAttack = isValidRookMove(r, c, targetRow, targetCol, boardCopy);

            if (canAttack) return true;
        }
      }
    }
  }
  
  // 检查将帅对脸（飞将）攻击
  const kingPos = findKingPosition(board, attackerColor);
  const opponentKingColor = attackerColor === 'red' ? 'black' : 'red';
  const opponentKingPos = findKingPosition(board, opponentKingColor);
  // 检查攻击方将/帅存在，对手将/帅存在，且它们在同一列（纵线）
  // 同时确保我们检查的目标格子是对手将/帅的位置
  if (kingPos && opponentKingPos && kingPos[1] === opponentKingPos[1] && targetRow === opponentKingPos[0] && targetCol === opponentKingPos[1]) {
      const col = kingPos[1]; // 它们共用的列
      const startRow = Math.min(kingPos[0], opponentKingPos[0]);
      const endRow = Math.max(kingPos[0], opponentKingPos[0]);
      let interveningPieces = 0;
      for (let i = startRow + 1; i < endRow; i++) {
          if (board[i][col]) {
              interveningPieces++;
              break; // 找到一个中间棋子
          }
      }
      // 如果它们之间没有棋子，攻击方的将/帅攻击对手将/帅的位置
      if (interveningPieces === 0) return true;
  }

  return false;
};

// 检查指定颜色的将/帅是否被将军
export const isKingInCheck = (board: (string | null)[][], kingColor: 'red' | 'black'): boolean => {
  const kingPos = findKingPosition(board, kingColor);
  if (!kingPos) return false; // 将/帅不在棋盘上？

  const attackerColor = kingColor === 'red' ? 'black' : 'red';
  return isSquareAttacked(board, kingPos[0], kingPos[1], attackerColor);
};

// 综合移动验证函数，包含所有棋子类型的规则验证
export const isValidMove = (board: (string | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
  const piece = board[fromRow][fromCol]
  if (!piece) return false

  // 获取棋子颜色
  const pieceColor = isPieceColor(piece)
  if (!pieceColor) return false

  // 检查目标位置是否有己方棋子
  const targetPiece = board[toRow][toCol]
  if (targetPiece && isPieceColor(targetPiece) === pieceColor) {
    return false
  }

  // 根据棋子类型检查移动规则
  switch (piece) {
    case '帅':
    case '将':
      return isValidKingMove(fromRow, fromCol, toRow, toCol, pieceColor)
    case '仕':
    case '士':
      return isValidAdvisorMove(fromRow, fromCol, toRow, toCol, pieceColor)
    case '相':
    case '象':
      return isValidElephantMove(fromRow, fromCol, toRow, toCol, pieceColor, board)
    case '马':
    case '馬':
      return isValidHorseMove(fromRow, fromCol, toRow, toCol, board)
    case '车':
    case '車':
      return isValidRookMove(fromRow, fromCol, toRow, toCol, board)
    case '炮':
    case '砲':
      return isValidCannonMove(fromRow, fromCol, toRow, toCol, board)
    case '兵':
    case '卒':
      return isValidPawnMove(fromRow, fromCol, toRow, toCol, pieceColor)
    default:
      return false
  }
}

// 检查玩家是否有任何合法移动可以解除将军
export const hasLegalMoves = (board: (string | null)[][], playerColor: 'red' | 'black'): boolean => {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && isPieceColor(piece) === playerColor) {
        // 找到属于该玩家的棋子
        // 尝试将该棋子移动到每个可能的位置
        for (let tr = 0; tr < 10; tr++) {
          for (let tc = 0; tc < 9; tc++) {
            // 检查基本移动是否有效（符合移动规则、路径、不吃自己的子）
            if (isValidMove(board, r, c, tr, tc)) {
              // 模拟移动
              let boardCopy = [...board.map(row => [...row])]; // 深拷贝棋盘避免修改原棋盘
              const originalTargetPiece = boardCopy[tr][tc];
              boardCopy[tr][tc] = piece; // 移动棋子
              boardCopy[r][c] = null;    // 清空原位置
              
              // 检查移动后王是否安全（不在被将军状态）
              const kingSafe = !isKingInCheck(boardCopy, playerColor);
              
              if (kingSafe) {
                // 找到至少一个可以解除将军的合法移动
                return true; 
              }
            }
          }
        }
      }
    }
  }
  // 如果遍历了所有可能性都找不到安全的移动
  return false; 
}; 