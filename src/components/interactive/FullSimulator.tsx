import { useState } from 'react';
import { Card } from '../core/Card';
import { CoachTape } from '../core/CoachTape';
import { Chip } from '../core/Chip';
import { Lab } from './Lab';
import { act, newHand, type PlayerAction } from './simulatorMachine';

export default function FullSimulator() {
  const [state, setState] = useState(() => newHand());
  const takeAction = (action: PlayerAction) => setState((current) => act(current, action));
  return <Lab title="โต๊ะทดลอง 5/10" description="เล่นหนึ่งมือกับบอท 3 คน พร้อมคำอธิบายกฎในแต่ละจังหวะ">
    <div className="sim-status"><span>รอบ <b>{state.street.toUpperCase()}</b></span><span>Pot <Chip value={state.pot} /></span></div>
    <div className="sim-table table-felt"><div className="sim-board card-row">{state.board.length ? state.board.map((card) => <Card card={card} key={`${card.rank}${card.suit}`} />) : <span>ไพ่กองกลาง</span>}</div>{state.players.map((player, index) => <div className={`sim-player sim-${index} ${player.folded ? 'folded' : ''}`} key={player.id}><b>{player.name}</b><small>{player.folded ? 'หมอบ' : `${player.stack} ชิป`}</small><div className="card-row">{player.cards.map((card) => <Card card={card} hidden={index !== 0 && state.street !== 'showdown'} key={`${card.rank}${card.suit}`} />)}</div></div>)}</div>
    <CoachTape tone={state.winner ? 'tip' : 'warning'}>{state.message}</CoachTape>
    {state.street !== 'showdown' ? <div className="lab-controls simulator-actions"><button className="lab-button secondary" onClick={() => takeAction('fold')}>Fold</button><button className="lab-button" onClick={() => takeAction('call')}>Call 10</button><button className="lab-button" onClick={() => takeAction('raise')}>Raise 30</button><button className="lab-button secondary" onClick={() => takeAction('all-in')}>All-in</button></div> : <div className="lab-controls"><button className="lab-button" onClick={() => setState(newHand())}>เล่นมือใหม่</button></div>}
  </Lab>;
}
