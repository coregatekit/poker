import { describe, expect, it } from 'vitest';
import { compareHands, createDeck, distributePots, evaluateHand, parseCard } from './engine';

const cards = (value: string) => value.split(' ').map(parseCard);
const hand = (value: string) => evaluateHand(cards(value));

describe('evaluateHand', () => {
  it.each([
    ['As Kd 9c 7h 3s', 'high-card'],
    ['As Ad 9c 7h 3s', 'pair'],
    ['As Ad 9c 9h 3s', 'two-pair'],
    ['As Ad Ac 7h 3s', 'three-kind'],
    ['9s 8d 7c 6h 5s', 'straight'],
    ['As Js 9s 7s 3s', 'flush'],
    ['As Ad Ac 7h 7s', 'full-house'],
    ['As Ad Ac Ah 3s', 'four-kind'],
    ['9s 8s 7s 6s 5s', 'straight-flush']
  ])('recognizes %s as %s', (value, category) => {
    expect(hand(value).category).toBe(category);
  });

  it('uses the best five of seven cards', () => {
    expect(hand('As Ks Qs Js Ts 2d 2c').category).toBe('straight-flush');
  });
  it('recognizes the wheel straight', () => {
    expect(hand('As 2d 3c 4h 5s').score).toEqual([5]);
  });
  it('does not wrap queen through ace to two', () => {
    expect(hand('Qs Kd Ac 2h 3s').category).toBe('high-card');
  });
  it('chooses a six-high straight over the wheel', () => {
    expect(hand('As 2d 3c 4h 5s 6d 9c').score).toEqual([6]);
  });
  it('rejects duplicate cards', () => {
    expect(() => hand('As As 3c 4h 5s')).toThrow('unique');
  });
  it('rejects fewer than five cards', () => {
    expect(() => hand('As Ks')).toThrow('5 to 7');
  });
});

describe('comparison and ties', () => {
  it('uses pair kickers in order', () => {
    expect(compareHands(hand('As Ad Kc 7h 3s'), hand('Ah Ac Qc 7d 3h'))).toBe(1);
  });
  it('compares the lower pair for two pair', () => {
    expect(compareHands(hand('As Ad 9c 9h 3s'), hand('Ah Ac 8c 8d Kh'))).toBe(1);
  });
  it('ties when the same board is the best hand', () => {
    const board = 'As Ks Qs Js Ts';
    expect(compareHands(hand(`${board} 2d 3c`), hand(`${board} 9d 9c`))).toBe(0);
  });
});

describe('side pots', () => {
  it('creates a main pot and side pot', () => {
    expect(distributePots([
      { id: 'A', committed: 50 }, { id: 'B', committed: 100 }, { id: 'C', committed: 100 }
    ]).map((pot) => pot.amount)).toEqual([150, 100]);
  });
  it('creates three nested pot layers', () => {
    expect(distributePots([
      { id: 'A', committed: 25 }, { id: 'B', committed: 50 },
      { id: 'C', committed: 100 }, { id: 'D', committed: 100 }
    ]).map((pot) => pot.amount)).toEqual([100, 75, 100]);
  });
  it('keeps folded chips but excludes the player from winning', () => {
    const pots = distributePots([
      { id: 'A', committed: 50, folded: true, hand: hand('As Ks Qs Js Ts') },
      { id: 'B', committed: 50, hand: hand('2s 2d 7c 8h 9s') }
    ]);
    expect(pots[0]).toMatchObject({ amount: 100, winnerIds: ['B'] });
  });
  it('splits a tied pot between multiple players', () => {
    const tied = hand('As Ks Qs Js Ts 2d 3c');
    const pots = distributePots([
      { id: 'A', committed: 40, hand: tied }, { id: 'B', committed: 40, hand: tied },
      { id: 'C', committed: 40, hand: hand('2s 2d 7c 8h 9s') }
    ]);
    expect(pots[0].awards).toEqual({ A: 60, B: 60 });
  });
  it('awards an odd chip deterministically by input order', () => {
    const tied = hand('As Ks Qs Js Ts 2d 3c');
    const pots = distributePots([
      { id: 'A', committed: 5, hand: tied }, { id: 'B', committed: 5, hand: tied },
      { id: 'C', committed: 5, hand: hand('2s 2d 7c 8h 9s') }
    ]);
    expect(pots[0].awards).toEqual({ A: 8, B: 7 });
  });
  it('rejects fractional chip commitments', () => {
    expect(() => distributePots([{ id: 'A', committed: 1.5 }])).toThrow('integers');
  });
});

it('creates a unique 52-card deck', () => {
  expect(new Set(createDeck().map((card) => `${card.rank}${card.suit}`)).size).toBe(52);
});
