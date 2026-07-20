import { useMemo, useState } from 'react';
import { Card } from '../core/Card';
import { Lab } from './Lab';
import { cardCode, compareHands, evaluateHand, parseCard } from '../../engine/engine';

const boardOptions = [
  { label: 'บอร์ดฟลัช', value: 'As Js 8s 5s 2s' },
  { label: 'บอร์ดคู่', value: 'Kh Kd 7c 4s 2d' },
  { label: 'บอร์ดสเตรท', value: '9h 8d 7c 6s 5h' }
];
const holeOptions = ['Qs 3d', 'Ts 9d', 'Ah Qd', '7h 7d', 'Ac Kc', '2h 2c'];

export default function TieBreakerLab() {
  const [board, setBoard] = useState(0);
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const boardCards = useMemo(() => boardOptions[board].value.split(' ').map(parseCard), [board]);
  const calculate = (index: number) => evaluateHand([...boardCards, ...holeOptions[index].split(' ').map(parseCard)]);
  const left = calculate(a); const right = calculate(b);
  const result = compareHands(left, right);
  const bestCodes = (hand: ReturnType<typeof evaluateHand>) => new Set(hand.cards.map(cardCode));
  return <Lab title="Kicker และไพ่ 5 ใบที่ดีที่สุด" description="เปลี่ยนบอร์ดและไพ่ในมือ แล้วดูว่า engine เลือกใช้ใบไหนจริง">
    <div className="lab-controls"><label>บอร์ด <select className="lab-input wide" value={board} onChange={(event) => setBoard(Number(event.target.value))}>{boardOptions.map((option, index) => <option value={index} key={option.label}>{option.label}</option>)}</select></label></div>
    <div className="card-row board-cards">{boardCards.map((card) => <Card card={card} highlighted={bestCodes(left).has(cardCode(card)) && bestCodes(right).has(cardCode(card))} key={cardCode(card)} />)}</div>
    <div className="hand-compare">{[{ label: 'มือ A', value: a, set: setA, hand: left }, { label: 'มือ B', value: b, set: setB, hand: right }].map((player) => <div key={player.label}><label><b>{player.label}</b> <select className="lab-input" value={player.value} onChange={(event) => player.set(Number(event.target.value))}>{holeOptions.map((option, index) => <option value={index} key={option}>{option}</option>)}</select></label><div className="card-row">{holeOptions[player.value].split(' ').map(parseCard).map((card) => <Card card={card} highlighted={bestCodes(player.hand).has(cardCode(card))} key={cardCode(card)} />)}</div><p>{player.hand.name}</p></div>)}</div>
    <p className={result === 0 ? '' : 'status-good'}>{result === 0 ? 'เสมอ — ไพ่ 5 ใบที่ดีที่สุดเท่ากัน' : `มือ ${result > 0 ? 'A' : 'B'} ชนะ`}</p>
    <p className="lab-note">ขอบสีทอง = ไพ่ที่ถูกใช้ในชุด 5 ใบที่ดีที่สุด</p>
  </Lab>;
}
