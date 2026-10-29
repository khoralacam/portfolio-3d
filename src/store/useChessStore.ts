// src/store/useChessStore.ts
import { create } from 'zustand';
import { Chess } from 'chess.js';
import {
  AIDifficulty,
  BoardPiece,
  GameMode,
  GameStatus,
  LegalTarget,
  MoveRecord,
  PieceColor,
  PromotionPiece,
  Square,
} from '@/types/chess';
import { calculateBestMove } from '@/lib/chess/aiEngine';

interface PendingPromotion {
  from: Square;
  to: Square;
  color: PieceColor;
}

interface ChessStoreState {
  chess: Chess;
  fen: string;
  turn: PieceColor;
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  humanColor: PieceColor;
  isAiThinking: boolean;
  orientation: PieceColor;
  showCoordinates: boolean;
  selectedSquare: Square | null;
  legalTargets: LegalTarget[];
  lastMove: { from: Square; to: Square } | null;
  isCheck: boolean;
  status: GameStatus;
  winner: PieceColor | 'draw' | null;
  history: MoveRecord[];
  pendingPromotion: PendingPromotion | null;
  whiteTimeMs: number;
  blackTimeMs: number;

  // Actions
  setMode: (mode: GameMode) => void;
  setAiDifficulty: (difficulty: AIDifficulty) => void;
  setHumanColor: (color: PieceColor) => void;
  flipBoard: () => void;
  toggleCoordinates: () => void;
  selectSquare: (square: Square) => void;
  movePiece: (from: Square, to: Square, promotion?: PromotionPiece) => boolean;
  triggerAiTurnIfNeeded: () => void;
  completePromotion: (piece: PromotionPiece) => void;
  cancelPromotion: () => void;
  undoMove: () => void;
  resetGame: () => void;
  resignGame: (color: PieceColor) => void;
  offerDraw: () => void;
  tickClock: (deltaMs: number) => void;
  getPieceAt: (square: Square) => BoardPiece | null;
}

function evaluateGameStatus(chess: Chess): {
  status: GameStatus;
  winner: PieceColor | 'draw' | null;
} {
  if (chess.isCheckmate()) {
    return {
      status: 'checkmate',
      winner: chess.turn() === 'w' ? 'b' : 'w',
    };
  }
  if (chess.isStalemate()) return { status: 'stalemate', winner: 'draw' };
  if (chess.isThreefoldRepetition()) return { status: 'draw_repetition', winner: 'draw' };
  if (chess.isInsufficientMaterial()) return { status: 'draw_insufficient', winner: 'draw' };
  if (chess.isDraw()) return { status: 'draw_fifty_move', winner: 'draw' };

  return { status: 'active', winner: null };
}

export const useChessStore = create<ChessStoreState>((set, get) => {
  const initialChess = new Chess();

  return {
    chess: initialChess,
    fen: initialChess.fen(),
    turn: 'w',
    mode: 'ai', // Default to Play vs AI so it works immediately
    aiDifficulty: 'medium',
    humanColor: 'w',
    isAiThinking: false,
    orientation: 'w',
    showCoordinates: true,
    selectedSquare: null,
    legalTargets: [],
    lastMove: null,
    isCheck: false,
    status: 'active',
    winner: null,
    history: [],
    pendingPromotion: null,
    whiteTimeMs: 600_000,
    blackTimeMs: 600_000,

    setMode: (mode) => {
      set({ mode });
      get().resetGame();
    },

    setAiDifficulty: (aiDifficulty) => {
      set({ aiDifficulty });
    },

    setHumanColor: (humanColor) => {
      set({ humanColor, orientation: humanColor });
      get().resetGame();
    },

    flipBoard: () =>
      set((state) => ({ orientation: state.orientation === 'w' ? 'b' : 'w' })),

    toggleCoordinates: () =>
      set((state) => ({ showCoordinates: !state.showCoordinates })),

    getPieceAt: (square) => {
      const piece = get().chess.get(square);
      if (!piece) return null;
      return { type: piece.type, color: piece.color, square };
    },

    selectSquare: (square) => {
      const {
        chess,
        selectedSquare,
        legalTargets,
        status,
        turn,
        mode,
        humanColor,
        isAiThinking,
      } = get();

      if (status !== 'active' || isAiThinking) return;

      // In AI mode, prevent human from moving AI's pieces
      if (mode === 'ai' && turn !== humanColor) return;

      // 1. Clicking a valid destination square
      const targetMove = legalTargets.find((t) => t.to === square);
      if (selectedSquare && targetMove) {
        if (targetMove.isPromotion) {
          set({
            pendingPromotion: { from: selectedSquare, to: square, color: turn },
          });
          return;
        }
        get().movePiece(selectedSquare, square);
        return;
      }

      // 2. Clicking same square to deselect
      if (selectedSquare === square) {
        set({ selectedSquare: null, legalTargets: [] });
        return;
      }

      // 3. Clicking own piece to show legal targets
      const clickedPiece = chess.get(square);
      if (clickedPiece && clickedPiece.color === turn) {
        const moves = chess.moves({ square, verbose: true });
        const targets: LegalTarget[] = moves.map((m) => ({
          to: m.to as Square,
          isCapture: m.captured !== undefined || m.flags.includes('e'),
          isPromotion: m.flags.includes('p'),
        }));

        const uniqueTargets = Array.from(
          new Map(targets.map((item) => [item.to, item])).values()
        );

        set({ selectedSquare: square, legalTargets: uniqueTargets });
      } else {
        set({ selectedSquare: null, legalTargets: [] });
      }
    },

    movePiece: (from, to, promotion) => {
      const { chess, history, status } = get();
      if (status !== 'active') return false;

      const verboseMoves = chess.moves({ square: from, verbose: true });
      const matchingMove = verboseMoves.find((m) => m.to === to);
      if (!matchingMove) return false;

      if (matchingMove.flags.includes('p') && !promotion) {
        set({
          pendingPromotion: { from, to, color: chess.turn() },
        });
        return false;
      }

      try {
        const moveResult = chess.move({
          from,
          to,
          promotion: promotion || 'q',
        });

        if (!moveResult) return false;

        const { status: newStatus, winner } = evaluateGameStatus(chess);

        const newRecord: MoveRecord = {
          san: moveResult.san,
          from: moveResult.from as Square,
          to: moveResult.to as Square,
          color: moveResult.color,
          piece: moveResult.piece,
          captured: moveResult.captured,
          promotion: moveResult.promotion,
          fenAfter: chess.fen(),
        };

        set({
          fen: chess.fen(),
          turn: chess.turn(),
          selectedSquare: null,
          legalTargets: [],
          lastMove: { from, to },
          isCheck: chess.inCheck(),
          status: newStatus,
          winner,
          history: [...history, newRecord],
          pendingPromotion: null,
        });

        // Trigger AI response if it is now AI's turn
        get().triggerAiTurnIfNeeded();

        return true;
      } catch {
        return false;
      }
    },

    triggerAiTurnIfNeeded: () => {
      const { mode, status, turn, humanColor, fen, aiDifficulty } = get();
      if (mode !== 'ai' || status !== 'active' || turn === humanColor) return;

      set({ isAiThinking: true });

      setTimeout(() => {
        const currentState = get();
        if (
          currentState.mode !== 'ai' ||
          currentState.status !== 'active' ||
          currentState.turn === currentState.humanColor
        ) {
          set({ isAiThinking: false });
          return;
        }

        const aiMove = calculateBestMove(fen, aiDifficulty);
        set({ isAiThinking: false });

        if (aiMove) {
          get().movePiece(aiMove.from, aiMove.to, aiMove.promotion || 'q');
        }
      }, 350);
    },

    completePromotion: (piece) => {
      const { pendingPromotion } = get();
      if (!pendingPromotion) return;
      get().movePiece(pendingPromotion.from, pendingPromotion.to, piece);
    },

    cancelPromotion: () => set({ pendingPromotion: null }),

    undoMove: () => {
      const { chess, history, mode, isAiThinking } = get();
      if (isAiThinking || history.length === 0) return;

      // In AI mode, undo both the AI's move and the human's move (2 plies)
      const pliesToUndo = mode === 'ai' && history.length >= 2 ? 2 : 1;

      for (let i = 0; i < pliesToUndo; i++) {
        chess.undo();
      }

      const updatedHistory = history.slice(0, history.length - pliesToUndo);
      const previousMove = updatedHistory[updatedHistory.length - 1] || null;

      set({
        fen: chess.fen(),
        turn: chess.turn(),
        selectedSquare: null,
        legalTargets: [],
        lastMove: previousMove ? { from: previousMove.from, to: previousMove.to } : null,
        isCheck: chess.inCheck(),
        status: 'active',
        winner: null,
        history: updatedHistory,
        pendingPromotion: null,
      });
    },

    resetGame: () => {
      const freshChess = new Chess();
      set({
        chess: freshChess,
        fen: freshChess.fen(),
        turn: 'w',
        isAiThinking: false,
        selectedSquare: null,
        legalTargets: [],
        lastMove: null,
        isCheck: false,
        status: 'active',
        winner: null,
        history: [],
        pendingPromotion: null,
        whiteTimeMs: 600_000,
        blackTimeMs: 600_000,
      });

      // If human chose Black in AI mode, AI (White) must make the first move!
      setTimeout(() => {
        get().triggerAiTurnIfNeeded();
      }, 150);
    },

    resignGame: (resigningColor) => {
      if (get().status !== 'active') return;
      set({
        status: 'resigned',
        winner: resigningColor === 'w' ? 'b' : 'w',
        isAiThinking: false,
        selectedSquare: null,
        legalTargets: [],
      });
    },

    offerDraw: () => {
      if (get().status !== 'active') return;
      set({
        status: 'draw_agreement',
        winner: 'draw',
        isAiThinking: false,
        selectedSquare: null,
        legalTargets: [],
      });
    },

    tickClock: (deltaMs) => {
      const { status, turn, history, whiteTimeMs, blackTimeMs } = get();
      if (status !== 'active' || history.length === 0) return;

      if (turn === 'w') {
        const nextWhite = Math.max(0, whiteTimeMs - deltaMs);
        set({
          whiteTimeMs: nextWhite,
          ...(nextWhite === 0 ? { status: 'timeout', winner: 'b' } : {}),
        });
      } else {
        const nextBlack = Math.max(0, blackTimeMs - deltaMs);
        set({
          blackTimeMs: nextBlack,
          ...(nextBlack === 0 ? { status: 'timeout', winner: 'w' } : {}),
        });
      }
    },
  };
});