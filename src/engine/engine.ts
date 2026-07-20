export const SUITS = ['s', 'h', 'd', 'c'] as const;
export type Suit = (typeof SUITS)[number];

export interface Card {
  rank: number;
  suit: Suit;
}

export type HandCategory =
  | 'high-card' | 'pair' | 'two-pair' | 'three-kind' | 'straight'
  | 'flush' | 'full-house' | 'four-kind' | 'straight-flush';

export interface HandEval {
  category: HandCategory;
  categoryRank: number;
  score: number[];
  cards: Card[];
  name: string;
}

export interface PotPlayer {
  id: string;
  committed: number;
  folded?: boolean;
  hand?: HandEval;
}

export interface PotResult {
  amount: number;
  cap: number;
  eligibleIds: string[];
  winnerIds: string[];
  awards: Record<string, number>;
}

const CATEGORY: Record<HandCategory, { rank: number; name: string }> = {
  'high-card': { rank: 0, name: 'ไพ่สูง' },
  pair: { rank: 1, name: 'หนึ่งคู่' },
  'two-pair': { rank: 2, name: 'สองคู่' },
  'three-kind': { rank: 3, name: 'ตอง' },
  straight: { rank: 4, name: 'สเตรท' },
  flush: { rank: 5, name: 'ฟลัช' },
  'full-house': { rank: 6, name: 'ฟูลเฮาส์' },
  'four-kind': { rank: 7, name: 'โฟร์การ์ด' },
  'straight-flush': { rank: 8, name: 'สเตรทฟลัช' }
};

const RANK_CHARS = '23456789TJQKA';

export function parseCard(value: string): Card {
  const normalized = value.trim();
  const rank = RANK_CHARS.indexOf(normalized[0]?.toUpperCase()) + 2;
  const suit = normalized[1]?.toLowerCase() as Suit;
  if (normalized.length !== 2 || rank < 2 || !SUITS.includes(suit)) {
    throw new Error(`Invalid card: ${value}`);
  }
  return { rank, suit };
}

export function cardCode(card: Card): string {
  return `${RANK_CHARS[card.rank - 2]}${card.suit}`;
}

function straightHigh(ranks: number[]): number | null {
  const unique = [...new Set(ranks)].sort((a, b) => b - a);
  if (unique.includes(14)) unique.push(1);
  for (let i = 0; i <= unique.length - 5; i += 1) {
    if (unique.slice(i, i + 5).every((rank, j) => j === 0 || unique[i + j - 1] - rank === 1)) {
      return unique[i];
    }
  }
  return null;
}

function evaluateFive(cards: Card[]): HandEval {
  const ranks = cards.map((card) => card.rank);
  const counts = new Map<number, number>();
  for (const rank of ranks) counts.set(rank, (counts.get(rank) ?? 0) + 1);
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const flush = cards.every((card) => card.suit === cards[0].suit);
  const high = straightHigh(ranks);

  let category: HandCategory;
  let score: number[];
  if (flush && high) {
    category = 'straight-flush'; score = [high];
  } else if (groups[0][1] === 4) {
    category = 'four-kind'; score = [groups[0][0], groups[1][0]];
  } else if (groups[0][1] === 3 && groups[1][1] === 2) {
    category = 'full-house'; score = [groups[0][0], groups[1][0]];
  } else if (flush) {
    category = 'flush'; score = [...ranks].sort((a, b) => b - a);
  } else if (high) {
    category = 'straight'; score = [high];
  } else if (groups[0][1] === 3) {
    category = 'three-kind'; score = [groups[0][0], ...groups.slice(1).map(([rank]) => rank).sort((a, b) => b - a)];
  } else if (groups[0][1] === 2 && groups[1][1] === 2) {
    const pairs = [groups[0][0], groups[1][0]].sort((a, b) => b - a);
    category = 'two-pair'; score = [...pairs, groups[2][0]];
  } else if (groups[0][1] === 2) {
    category = 'pair'; score = [groups[0][0], ...groups.slice(1).map(([rank]) => rank).sort((a, b) => b - a)];
  } else {
    category = 'high-card'; score = [...ranks].sort((a, b) => b - a);
  }
  return { category, categoryRank: CATEGORY[category].rank, score, cards, name: CATEGORY[category].name };
}

export function compareHands(a: HandEval, b: HandEval): number {
  if (a.categoryRank !== b.categoryRank) return Math.sign(a.categoryRank - b.categoryRank);
  const length = Math.max(a.score.length, b.score.length);
  for (let i = 0; i < length; i += 1) {
    if ((a.score[i] ?? 0) !== (b.score[i] ?? 0)) return Math.sign((a.score[i] ?? 0) - (b.score[i] ?? 0));
  }
  return 0;
}

function combinations<T>(values: T[], count: number): T[][] {
  if (count === 0) return [[]];
  if (values.length < count) return [];
  const [first, ...rest] = values;
  return [
    ...combinations(rest, count - 1).map((items) => [first, ...items]),
    ...combinations(rest, count)
  ];
}

export function evaluateHand(cards: Card[]): HandEval {
  if (cards.length < 5 || cards.length > 7) throw new Error('A hand needs 5 to 7 cards');
  if (new Set(cards.map(cardCode)).size !== cards.length) throw new Error('Cards must be unique');
  return combinations(cards, 5).map(evaluateFive).reduce((best, hand) => compareHands(hand, best) > 0 ? hand : best);
}

export function distributePots(players: PotPlayer[]): PotResult[] {
  if (players.some((player) => !Number.isInteger(player.committed) || player.committed < 0)) {
    throw new Error('Committed chips must be non-negative integers');
  }
  const levels = [...new Set(players.map((player) => player.committed).filter(Boolean))].sort((a, b) => a - b);
  let previous = 0;
  return levels.map((cap) => {
    const contributors = players.filter((player) => player.committed >= cap);
    const eligible = contributors.filter((player) => !player.folded);
    const amount = (cap - previous) * contributors.length;
    previous = cap;
    let winners: PotPlayer[] = [];
    for (const player of eligible) {
      if (!player.hand) continue;
      if (!winners.length || compareHands(player.hand, winners[0].hand!) > 0) winners = [player];
      else if (compareHands(player.hand, winners[0].hand!) === 0) winners.push(player);
    }
    const awards: Record<string, number> = {};
    if (winners.length) {
      const share = Math.floor(amount / winners.length);
      const remainder = amount % winners.length;
      winners.forEach((winner, index) => { awards[winner.id] = share + (index < remainder ? 1 : 0); });
    }
    return { amount, cap, eligibleIds: eligible.map(({ id }) => id), winnerIds: winners.map(({ id }) => id), awards };
  });
}

export function createDeck(): Card[] {
  return SUITS.flatMap((suit) => Array.from({ length: 13 }, (_, index) => ({ rank: index + 2, suit })));
}

export function shuffleDeck(random = Math.random): Card[] {
  const deck = createDeck();
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
