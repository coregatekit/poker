import { useState } from 'react';
import { Lab } from './Lab';

const scenarios = [
  { label: 'เดิมพันแรก 20', current: 20, lastRaise: 20, minimum: 40 },
  { label: 'เดิมพัน 20 → เรสเป็น 60', current: 60, lastRaise: 40, minimum: 100 },
  { label: 'เดิมพัน 50 → เรสเป็น 125', current: 125, lastRaise: 75, minimum: 200 }
];

export default function BettingPlayground() {
  const [scenario, setScenario] = useState(0);
  const [amount, setAmount] = useState(60);
  const item = scenarios[scenario];
  const valid = Number.isFinite(amount) && amount >= item.minimum;
  return <Lab title="ทดลองเรสขั้นต่ำ" description="ยอดที่พูดคือยอดรวมหลังเรส ไม่ใช่ชิปที่เพิ่มอย่างเดียว">
    <label>สถานการณ์ <select className="lab-input wide" value={scenario} onChange={(event) => { const next = Number(event.target.value); setScenario(next); setAmount(scenarios[next].minimum); }}>{scenarios.map((option, index) => <option value={index} key={option.label}>{option.label}</option>)}</select></label>
    <div className="bet-line"><span>ยอดปัจจุบัน <b>{item.current}</b></span><span>ขนาดเรสล่าสุด <b>{item.lastRaise}</b></span><span>เรสขั้นต่ำเป็น <b>{item.minimum}</b></span></div>
    <div className="lab-controls"><label>ฉันจะเรสเป็น <input className="lab-input" type="number" min={item.current + 1} step="5" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /></label></div>
    <p aria-live="polite" className={valid ? 'status-good' : 'status-bad'}>{valid ? `✓ ถูกกติกา — เพิ่มจาก ${item.current} อย่างน้อย ${item.lastRaise}` : `✗ ต้องเรสเป็นอย่างน้อย ${item.minimum} เพราะเรสล่าสุดเพิ่มขึ้น ${item.lastRaise}`}</p>
  </Lab>;
}
