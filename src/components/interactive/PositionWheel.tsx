import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Lab } from './Lab';

function positionNames(count: number): string[] {
  if (count === 2) return ['BTN · SB', 'BB'];
  const middle = count === 3 ? [] : count === 4 ? ['UTG'] : count === 5 ? ['UTG', 'CO'] : Array.from({ length: count - 4 }, (_, i) => i === 0 ? 'UTG' : `MP${i}`);
  return ['BTN', 'SB', 'BB', ...middle, ...(middle.at(-1) === 'CO' ? [] : ['CO'])].slice(0, count);
}

export default function PositionWheel() {
  const [count, setCount] = useState(6);
  const [button, setButton] = useState(0);
  const positions = useMemo(() => positionNames(count), [count]);
  return <Lab title="วงล้อตำแหน่ง" description="ปรับจำนวนผู้เล่น แล้วเลื่อนปุ่มดีลเลอร์ไปยังมือถัดไป">
    <div className="wheel" aria-label={`โต๊ะ ${count} คน`}>
      {positions.map((_, index) => {
        const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
        const rotatedIndex = (index - button + count) % count;
        return <motion.div layout className="wheel-seat" key={index} style={{ left: `${50 + Math.cos(angle) * 40}%`, top: `${50 + Math.sin(angle) * 40}%` }}>
          <b>ผู้เล่น {index + 1}</b><span>{positions[rotatedIndex]}</span>
        </motion.div>;
      })}
      <div className="wheel-center">{count === 2 ? 'Heads-up' : `${count} คน`}</div>
    </div>
    <div className="lab-controls"><label>จำนวนผู้เล่น <input aria-label="จำนวนผู้เล่น" type="range" min="2" max="9" value={count} onChange={(event) => { setCount(Number(event.target.value)); setButton(0); }} /> <b>{count}</b></label><button className="lab-button" onClick={() => setButton((value) => (value + 1) % count)}>มือถัดไป</button></div>
    {count === 2 && <p className="lab-note">เมื่อเหลือ 2 คน ปุ่ม BTN และ SB จะอยู่ที่คนเดียวกัน</p>}
  </Lab>;
}
