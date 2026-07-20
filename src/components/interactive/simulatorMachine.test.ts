import { describe, expect, it } from 'vitest';
import { act, newHand } from './simulatorMachine';

const predictable = () => 0.42;

describe('simulator state machine', () => {
  it('starts with 5/10 blinds in the pot', () => {
    const state = newHand(predictable);
    expect(state.pot).toBe(15);
    expect(state.players.map((player) => player.stack)).toEqual([200, 195, 190, 200]);
  });
  it('reveals flop, turn and river in order', () => {
    let state = newHand(predictable);
    state = act(state, 'call'); expect(state.board).toHaveLength(3);
    state = act(state, 'call'); expect(state.board).toHaveLength(4);
    state = act(state, 'call'); expect(state.board).toHaveLength(5);
    state = act(state, 'call'); expect(state.street).toBe('showdown');
  });
  it('runs out all five cards on all-in', () => {
    const state = act(newHand(predictable), 'all-in');
    expect(state.street).toBe('showdown');
    expect(state.board).toHaveLength(5);
    expect(state.winner).toBeDefined();
  });
});
