import { compareHands, evaluateHand, shuffleDeck, type Card, type HandEval } from '../../engine/engine';

export type Street = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
export type PlayerAction = 'call' | 'raise' | 'fold' | 'all-in';

export interface SimPlayer {
  id: string;
  name: string;
  stack: number;
  cards: Card[];
  folded: boolean;
}

export interface SimulatorState {
  street: Street;
  players: SimPlayer[];
  board: Card[];
  runout: Card[];
  pot: number;
  message: string;
  winner?: { name: string; hand: HandEval };
}

const nextStreet: Record<Exclude<Street, 'showdown'>, Street> = { preflop: 'flop', flop: 'turn', turn: 'river', river: 'showdown' };
const visibleCount: Record<Street, number> = { preflop: 0, flop: 3, turn: 4, river: 5, showdown: 5 };

export function newHand(random = Math.random): SimulatorState {
  const deck = shuffleDeck(random);
  const names = ['คุณ', 'นิด', 'ก้อง', 'ฝน'];
  const players = names.map((name, index) => ({ id: String(index), name, stack: 200, cards: [deck[index], deck[index + 4]], folded: false }));
  players[1].stack -= 5; players[2].stack -= 10;
  return { street: 'preflop', players, board: [], runout: deck.slice(8, 13), pot: 15, message: 'คุณอยู่ UTG — ตัดสินใจก่อนในรอบ Pre-flop' };
}

function resolveShowdown(state: SimulatorState): SimulatorState {
  const contenders = state.players.filter((player) => !player.folded).map((player) => ({ player, hand: evaluateHand([...player.cards, ...state.runout]) }));
  const winner = contenders.reduce((best, item) => compareHands(item.hand, best.hand) > 0 ? item : best);
  return { ...state, street: 'showdown', board: state.runout, winner: { name: winner.player.name, hand: winner.hand }, message: `${winner.player.name} ชนะด้วย${winner.hand.name}` };
}

export function act(state: SimulatorState, action: PlayerAction): SimulatorState {
  if (state.street === 'showdown') return state;
  const players = state.players.map((player) => ({ ...player }));
  const user = players[0];
  if (action === 'fold') user.folded = true;
  const payment = action === 'raise' ? 30 : action === 'all-in' ? user.stack : action === 'call' ? 10 : 0;
  user.stack -= payment;
  const botPayment = action === 'raise' ? 30 : action === 'all-in' ? 60 : 10;
  players.slice(1).forEach((player, index) => { if (index === 2 && action === 'raise') player.folded = true; else if (!player.folded) player.stack -= Math.min(player.stack, botPayment); });
  const paidByBots = players.slice(1).reduce((total, player, index) => total + (state.players[index + 1].stack - player.stack), 0);
  const updated = { ...state, players, pot: state.pot + payment + paidByBots };
  if (action === 'all-in') return resolveShowdown(updated);
  const street = nextStreet[state.street];
  if (street === 'showdown') return resolveShowdown(updated);
  return { ...updated, street, board: state.runout.slice(0, visibleCount[street]), message: `เปิด ${street === 'flop' ? 'Flop 3 ใบ' : street === 'turn' ? 'Turn' : 'River'} — action เริ่มซ้ายมือของปุ่ม` };
}
