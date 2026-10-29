// src/components/games/chess-nexus/ui/NexusButton.tsx
'use client';

import React from 'react';
import clsx from 'clsx';

interface NexusButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function NexusButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}: NexusButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#FFD400] text-[#08090B] hover:bg-[#FFE45C] shadow-[0_0_15px_rgba(255,212,0,0.2)]',
    secondary:
      'bg-[#171A20] text-[#F5F5F5] border border-white/10 hover:border-[#FFD400]/50 hover:text-[#FFD400]',
    outline:
      'bg-transparent border border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400]/10',
    danger:
      'bg-[#FF4545]/10 border border-[#FF4545]/40 text-[#FF4545] hover:bg-[#FF4545] hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}