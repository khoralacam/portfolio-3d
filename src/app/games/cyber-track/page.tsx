// src/app/games/chess-nexus/page.tsx
import { CyberTrackShell } from '@/components/games/cycber-track/layout/CyberTrackShell';
import React from 'react';


export const metadata = {
  title: 'CHESS NEXUS | Premium Full-Stack Chess',
  description: 'Play offline AI chess, local 2-player, or real-time online multiplayer in a luxury dark & yellow interface.',
};

export default function ChessNexusPage() {
  return <CyberTrackShell/>;
}