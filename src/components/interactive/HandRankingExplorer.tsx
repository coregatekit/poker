import { useMemo, useState } from 'react';
import { Card } from '../core/Card';
import { Lab } from './Lab';
import { compareHands, evaluateHand, parseCard, type HandCategory } from '../../engine/engine';

const examples: { category: HandCategory; label: string; cards: string[] }[] = [
  { category: 'straight-flush', label: 'รอยัลฟลัช', cards: ['As Ks Qs Js Ts', 'Ah Kh Qh Jh Th'] },
  { category: 'straight-flush', label: 'สเตรทฟลัช', cards: ['9s 8s 7s 6s 5s', 'As Ks Qs Js Ts'] },
  { category: 'four-kind', label: 'โฟร์การ์ด', cards: ['Ah Ad Ac As 7d', '9h 9d 9c 9s Ks'] },
  { category: 'full-house', label: 'ฟูลเฮาส์', cards: ['Kh Kd Kc 4s 4d', '8h 8d 8c As Ad'] },
  { category: 'flush', label: 'ฟลัช', cards: ['Ah Jh 8h 5h 2h', 'Ks Ts 7s 4s 3s'] },
  { category: 'straight', label: 'สเตรท', cards: ['9h 8d 7c 6s 5h', 'As 2d 3h 4c 5s'] },
  { category: 'three-kind', label: 'ตอง', cards: ['Qh Qd Qc 8s 2d', '7h 7d 7c As Kd'] },
  { category: 'two-pair', label: 'สองคู่', cards: ['Ah Ad Kc Ks 2d', 'Jh Jd 8c 8s Ah'] },
  { category: 'pair', label: 'หนึ่งคู่', cards: ['Ah Ad Kc 8s 2d', '9h 9d Ac Js 4h'] },
  { category: 'high-card', label: 'ไพ่สูง', cards: ['Ah Jd 8c 5s 2d', 'Kh Qd 9c 6s 3h'] }
];

export default function HandRankingExplorer() {
  const [selected, setSelected] = useState(0);
  const [variant, setVariant] = useState(0);
  const [guess, setGuess] = useState<'A' | 'B' | null>(null);
  const left = useMemo(() => evaluateHand('As Ad Kc 8s 2d'.split(' ').map(parseCard)), []);
  const right = useMemo(() => evaluateHand('Kh Kd Qc Js 9h'.split(' ').map(parseCard)), []);
  const answer = compareHands(left, right) > 0 ? 'A' : 'B';
  const current = examples[selected];
  const display = current.cards[variant % current.cards.length].split(' ').map(parseCard);
  return <Lab title="สำรวจอันดับไพ่" description="เลือกอันดับแล้วกดสุ่มเพื่อดูไพ่ตัวอย่างชุดใหม่">
    <div className="rank-grid" role="list" aria-label="อันดับไพ่">
      {examples.map((item, index) => <button key={item.category} className={`rank-choice ${selected === index ? 'selected' : ''}`} onClick={() => { setSelected(index); setVariant(0); }}>
        <span>{index + 1}</span>{item.label}
      </button>)}
    </div>
    <div className="rank-stage" key={`${selected}-${variant}`}><strong>{current.label}</strong><div className="card-row">{display.map((card) => <Card key={`${card.rank}${card.suit}`} card={card} />)}</div></div>
    <div className="lab-controls"><button className="lab-button" onClick={() => setVariant((value) => value + 1)}>สุ่มตัวอย่าง</button></div>
    <details className="guess-box"><summary>โหมดทาย: มือไหนชนะ?</summary>
      <div className="versus"><div><b>มือ A</b><div className="card-row">{'As Ad Kc 8s 2d'.split(' ').map(parseCard).map((card) => <Card key={`${card.rank}${card.suit}`} card={card} />)}</div></div><span>VS</span><div><b>มือ B</b><div className="card-row">{'Kh Kd Qc Js 9h'.split(' ').map(parseCard).map((card) => <Card key={`${card.rank}${card.suit}`} card={card} />)}</div></div></div>
      <div className="lab-controls">{(['A', 'B'] as const).map((choice) => <button className="lab-button secondary" onClick={() => setGuess(choice)} key={choice}>มือ {choice}</button>)}</div>
      {guess && <p className={guess === answer ? 'status-good' : 'status-bad'}>{guess === answer ? 'ถูกต้อง — คู่เอซชนะคู่คิง' : 'ยังไม่ใช่ — เปรียบเทียบอันดับคู่ก่อน kicker'}</p>}
    </details>
  </Lab>;
}
