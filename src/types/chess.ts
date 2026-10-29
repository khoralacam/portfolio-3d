// src/types/chess.ts

export type PieceColor = 'w' | 'b';
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PromotionPiece = 'q' | 'r' | 'b' | 'n';
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type FileChar = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type RankChar = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type Square = `${FileChar}${RankChar}`;

export interface BoardPiece {
  type: PieceSymbol;
  color: PieceColor;
  square: Square;
}

export type GameMode = 'dashboard' | 'ai' | 'local' | 'online';

export type GameStatus =
  | 'active'
  | 'checkmate'
  | 'stalemate'
  | 'draw_repetition'
  | 'draw_insufficient'
  | 'draw_fifty_move'
  | 'draw_agreement'
  | 'resigned'
  | 'timeout';

export interface MoveRecord {
  san: string;
  from: Square;
  to: Square;
  color: PieceColor;
  piece: PieceSymbol;
  captured?: PieceSymbol;
  promotion?: PieceSymbol;
  fenAfter: string;
}

export interface LegalTarget {
  to: Square;
  isCapture: boolean;
  isPromotion: boolean;
}

export interface PlayerInfo {
  name: string;
  color: PieceColor;
  isOnline?: boolean;
  timeRemainingMs: number;
  isActiveTurn: boolean;
}