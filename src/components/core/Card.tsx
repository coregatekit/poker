import { motion } from 'motion/react';
import type { Card as PokerCard } from '../../engine/engine';

const rankLabel = (rank: number) => rank <= 10 ? String(rank) : ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' } as Record<number, string>)[rank];
const suitLabel = { s: '♠', h: '♥', d: '♦', c: '♣' } as const;

export interface CardProps {
  card?: PokerCard;
  hidden?: boolean;
  highlighted?: boolean;
  label?: string;
}

export function Card({ card, hidden = false, highlighted = false, label }: CardProps) {
  const red = card?.suit === 'h' || card?.suit === 'd';
  const spoken = hidden || !card ? 'ไพ่คว่ำ' : `${rankLabel(card.rank)} ดอก${suitLabel[card.suit]}`;
  return (
    <motion.span
      className={`playing-card ${red ? 'red' : ''} ${hidden || !card ? 'back' : ''} ${highlighted ? 'highlighted' : ''}`}
      aria-label={label ?? spoken}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: .22 }}
    >
      {hidden || !card ? <span aria-hidden="true">◆</span> : <><b>{rankLabel(card.rank)}</b><span>{suitLabel[card.suit]}</span></>}
    </motion.span>
  );
}
