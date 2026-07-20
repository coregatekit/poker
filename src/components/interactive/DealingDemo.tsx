import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Card } from '../core/Card';
import { Lab } from './Lab';
import { parseCard } from '../../engine/engine';

const script = [
  ...['As', 'Kd', 'Qh', 'Jc', 'Ts', '9d', '8h', '7c'].map((card, index) => ({ type: 'hole', card, seat: index % 4 })),
  { type: 'burn', card: '2s' }, { type: 'board', card: '6s' }, { type: 'board', card: '5d' }, { type: 'board', card: '4h' },
  { type: 'burn', card: '3c' }, { type: 'board', card: 'Kh' },
  { type: 'burn', card: '2d' }, { type: 'board', card: 'Ac' }
] as const;

export default function DealingDemo() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  useEffect(() => { if (!auto || step >= script.length) return; const timer = window.setTimeout(() => setStep((value) => value + 1), 500); return () => window.clearTimeout(timer); }, [auto, step]);
  const visible = script.slice(0, step);
  const holes = useMemo(() => Array.from({ length: 4 }, (_, seat) => visible.filter((item) => item.type === 'hole' && item.seat === seat).map((item) => parseCard(item.card))), [visible]);
  const board = visible.filter((item) => item.type === 'board').map((item) => parseCard(item.card));
  const burns = visible.filter((item) => item.type === 'burn').map((item) => parseCard(item.card));
  return <Lab title="สาธิตการแจกไพ่" description="แจกวนทีละใบ และเผาไพ่ก่อนเปิด Flop, Turn, River">
    <div className="deal-table"><div className="deck"><Card hidden /><small>สำรับ</small></div><div className="community"><div className="card-row">{board.map((card) => <Card card={card} key={`${card.rank}${card.suit}`} />)}</div><small>ไพ่กองกลาง</small></div>{holes.map((cards, index) => <div className={`deal-seat seat-${index}`} key={index}><span>ผู้เล่น {index + 1}</span><div className="card-row">{cards.map((card) => <Card card={card} hidden key={`${card.rank}${card.suit}`} />)}</div></div>)}<AnimatePresence>{step > 0 && step <= script.length && <motion.span className="deal-pulse" key={step} initial={{ scale: .4, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }} />}</AnimatePresence></div>
    <p>Burn: {burns.length ? burns.map((card) => <span className="burn-card" key={`${card.rank}${card.suit}`}><Card card={card} /></span>) : 'ยังไม่มี'}</p>
    <div className="lab-controls"><button className="lab-button" disabled={step >= script.length} onClick={() => setStep((value) => value + 1)}>แจกทีละใบ</button><button className="lab-button secondary" onClick={() => setAuto((value) => !value)}>{auto ? 'หยุด' : 'เล่นอัตโนมัติ'}</button><button className="lab-button secondary" onClick={() => { setAuto(false); setStep(0); }}>เริ่มใหม่</button></div>
    <p className="lab-note">{step < 8 ? `กำลังแจกไพ่ในมือ ${step}/8 ใบ` : step === script.length ? 'แจกครบถึง River แล้ว' : 'ก่อนเปิดไพ่กองกลาง Dealer จะเผาไพ่ 1 ใบ'}</p>
  </Lab>;
}
