import { useState } from 'react';
import { Seat } from '../core/Seat';
import { Lab } from './Lab';

const preflop = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];
const postflop = ['SB', 'BB', 'UTG', 'MP', 'CO', 'BTN'];

export default function PlayOrderStepper() {
  const [street, setStreet] = useState<'pre' | 'post'>('pre');
  const [step, setStep] = useState(0);
  const order = street === 'pre' ? preflop : postflop;
  const advance = () => setStep((value) => (value + 1) % order.length);
  return <Lab title="ใครพูดก่อน?" description="กดทีละจังหวะเพื่อดู action วิ่งรอบโต๊ะ">
    <div className="street-tabs" role="group" aria-label="เลือกรอบเดิมพัน"><button aria-pressed={street === 'pre'} onClick={() => { setStreet('pre'); setStep(0); }}>Pre-flop</button><button aria-pressed={street === 'post'} onClick={() => { setStreet('post'); setStep(0); }}>หลัง Flop</button></div>
    <div className="order-row">{order.map((position, index) => <Seat key={position} name={position} active={step === index} />)}</div>
    <p><b>ลำดับที่ {step + 1}:</b> {order[step]} เป็นคนตัดสินใจ</p>
    <div className="lab-controls"><button className="lab-button" onClick={advance}>จังหวะถัดไป</button><button className="lab-button secondary" onClick={() => setStep(0)}>เริ่มใหม่</button></div>
    <p className="lab-note">{street === 'pre' ? 'Pre-flop เริ่มซ้ายมือของ Big Blind (UTG)' : 'หลังเปิด Flop เริ่มจากผู้เล่นที่ยังอยู่ซ้ายมือของปุ่ม'}</p>
  </Lab>;
}
