// src/lib/chess/aiEngine.ts
import { Chess, Move } from 'chess.js';
import { AIDifficulty, PromotionPiece, Square } from '@/types/chess';

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Positional bonus tables (White perspective, flipped for Black)
const PAWN_PST = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0],
];

const KNIGHT_PST = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50],
];

function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -99999 : 99999;
  }
  if (chess.isDraw()) return 0;

  const board = chess.board();
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const baseValue = PIECE_VALUES[piece.type] || 0;
      let positional = 0;

      const rowIdx = piece.color === 'w' ? r : 7 - r;
      if (piece.type === 'p') positional = PAWN_PST[rowIdx][c];
      if (piece.type === 'n') positional = KNIGHT_PST[rowIdx][c];

      if (piece.color === 'w') {
        score += baseValue + positional;
      } else {
        score -= baseValue + positional;
      }
    }
  }

  return score;
}

function orderMoves(moves: Move[]): Move[] {
  return moves.sort((a, b) => {
    const scoreA = (a.captured ? 10 * (PIECE_VALUES[a.captured] || 100) : 0) + (a.promotion ? 800 : 0);
    const scoreB = (b.captured ? 10 * (PIECE_VALUES[b.captured] || 100) : 0) + (b.promotion ? 800 : 0);
    return scoreB - scoreA;
  });
}

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingWhite: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const legalMoves = orderMoves(chess.moves({ verbose: true }));

  if (isMaximizingWhite) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function calculateBestMove(
  fen: string,
  difficulty: AIDifficulty
): { from: Square; to: Square; promotion?: PromotionPiece } | null {
  const chess = new Chess(fen);
  const legalMoves = orderMoves(chess.moves({ verbose: true }));
  if (legalMoves.length === 0) return null;

  // Easy mode: 40% chance of picking a random legal move so beginners can win
  if (difficulty === 'easy' && Math.random() < 0.4) {
    const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    return {
      from: randomMove.from as Square,
      to: randomMove.to as Square,
      promotion: (randomMove.promotion as PromotionPiece) || undefined,
    };
  }

  const depthMap: Record<AIDifficulty, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
    expert: 3,
  };

  const searchDepth = depthMap[difficulty];
  const isWhiteTurn = chess.turn() === 'w';

  let bestMove = legalMoves[0];
  let bestValue = isWhiteTurn ? -Infinity : Infinity;

  for (const move of legalMoves) {
    chess.move(move);
    const boardValue = minimax(
      chess,
      searchDepth - 1,
      -Infinity,
      Infinity,
      !isWhiteTurn
    );
    chess.undo();

    if (isWhiteTurn && boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = move;
    } else if (!isWhiteTurn && boardValue < bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
  }

  return {
    from: bestMove.from as Square,
    to: bestMove.to as Square,
    promotion: (bestMove.promotion as PromotionPiece) || undefined,
  };
}