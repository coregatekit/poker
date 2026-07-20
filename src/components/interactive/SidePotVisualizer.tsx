import { useMemo, useState } from 'react';
import { Chip } from '../core/Chip';
import { Lab } from './Lab';
import { distributePots } from '../../engine/engine';

const labels = ['มะลิ', 'นนท์', 'พิม', 'เจ'];

export default function SidePotVisualizer() {
  const [count, setCount] = useState(3);
  const [stacks, setStacks] = useState([40, 100, 160, 200]);
  const pots = useMemo(() => distributePots(stacks.slice(0, count).map((committed, index) => ({ id: labels[index], committed }))), [count, stacks]);
  const update = (index: number, amount: number) => setStacks((values) => values.map((value, i) => i === index ? amount : value));
  return <Lab title="แยก Main pot และ Side pot" description="ลากยอด all-in ของแต่ละคน ระบบจะแยกชิปเป็นชั้นตามสิทธิ์ชิง">
    <div className="player-sliders">{stacks.slice(0, count).map((stack, index) => <label key={labels[index]}><span><b>{labels[index]}</b><Chip value={stack} tone={index % 2 ? 'sage' : 'brass'} /></span><input aria-label={`ยอดของ ${labels[index]}`} type="range" min="10" max="200" step="10" value={stack} onChange={(event) => update(index, Number(event.target.value))} /></label>)}</div>
    <div className="pot-stack" aria-live="polite">{pots.map((pot, index) => <div className="pot-layer" key={pot.cap}><span>{index === 0 ? 'Main pot' : `Side pot ${index}`}</span><strong>{pot.amount} ชิป</strong><small>ผู้มีสิทธิ์: {pot.eligibleIds.join(', ')}</small></div>)}</div>
    <div className="lab-controls"><label>ผู้เล่น <select className="lab-input" value={count} onChange={(event) => setCount(Number(event.target.value))}><option value="3">3 คน</option><option value="4">4 คน</option></select></label></div>
  </Lab>;
}
