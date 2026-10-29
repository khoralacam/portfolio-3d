// src/app/games/chess-nexus/page.tsx
import React from 'react';
import { ChessNexusShell } from '@/components/games/chess-nexus/layout/ChessNexusShell';

export const metadata = {
  title: 'CHESS NEXUS | Premium Full-Stack Chess',
  description: 'Play offline AI chess, local 2-player, or real-time online multiplayer in a luxury dark & yellow interface.',
};

export default function ChessNexusPage() {
  return <ChessNexusShell />;
}