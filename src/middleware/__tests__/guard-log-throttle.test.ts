/**
 * The bounded decision-log throttle.
 *
 * The properties that matter are the ones a caller rotating header values
 * attacks: a scope's key budget caps what it can log, spending it touches no
 * other scope, and the cap holds however many distinct keys arrive.
 */
import { describe, expect, it } from 'vitest';

import { GuardLogThrottle, OVERFLOW_SCOPE } from '../guard-log-throttle';

const WINDOW_MS = 600_000;
const T0 = 1_800_000_000_000;

function throttle(keysPerScope = 3, maxScopes = 2): GuardLogThrottle {
  return new GuardLogThrottle({ windowMs: WINDOW_MS, keysPerScope, maxScopes });
}

describe('GuardLogThrottle', () => {
  it('logs a key once per window and again once the window has elapsed', () => {
    const t = throttle();
    expect(t.admit('none|edge', 'k', T0).action).toBe('log');
    expect(t.admit('none|edge', 'k', T0 + WINDOW_MS - 1).action).toBe('drop');
    expect(t.admit('none|edge', 'k', T0 + WINDOW_MS).action).toBe('log');
  });

  it('caps a scope at its key budget plus one overflow notice, however many keys arrive', () => {
    const t = throttle(3);
    const actions = Array.from({ length: 1_000 }, (_, i) =>
      t.admit('none|edge', `rotated-${i}`, T0).action
    );
    expect(actions.filter((a) => a === 'log')).toHaveLength(3);
    expect(actions.filter((a) => a === 'overflow')).toHaveLength(1);
    expect(actions.slice(4).every((a) => a === 'drop')).toBe(true);
  });

  it('keeps every other scope intact while one scope spends its budget', () => {
    const t = throttle(3);
    expect(t.admit('none|edge-b', 'legit', T0).action).toBe('log');
    for (let i = 0; i < 1_000; i += 1) t.admit('none|edge-a', `rotated-${i}`, T0);

    // Already logged: still remembered, so not logged again.
    expect(t.admit('none|edge-b', 'legit', T0).action).toBe('drop');
    // A new key in the untouched scope still has budget.
    expect(t.admit('none|edge-b', 'second', T0).action).toBe('log');
  });

  it('keeps a key already logged in the spent scope, rather than forgetting it', () => {
    const t = throttle(3);
    expect(t.admit('none|edge', 'legit', T0).action).toBe('log');
    for (let i = 0; i < 1_000; i += 1) t.admit('none|edge', `rotated-${i}`, T0);
    expect(t.admit('none|edge', 'legit', T0).action).toBe('drop');
  });

  it('routes scopes past the cap into one shared overflow scope', () => {
    const t = throttle(2, 2);
    expect(t.admit('none|a', 'k', T0)).toEqual({ action: 'log', scope: 'none|a' });
    expect(t.admit('none|b', 'k', T0)).toEqual({ action: 'log', scope: 'none|b' });
    expect(t.admit('none|c', 'k', T0)).toEqual({ action: 'log', scope: OVERFLOW_SCOPE });

    const later = Array.from({ length: 500 }, (_, i) => t.admit(`none|x${i}`, `k${i}`, T0).action);
    // The shared scope has one key left in its budget, then one notice.
    expect(later.filter((a) => a === 'log')).toHaveLength(1);
    expect(later.filter((a) => a === 'overflow')).toHaveLength(1);
  });

  it('restores every budget when the window rolls over', () => {
    const t = throttle(1);
    t.admit('none|edge', 'a', T0);
    expect(t.admit('none|edge', 'b', T0).action).toBe('overflow');
    expect(t.admit('none|edge', 'b', T0 + WINDOW_MS).action).toBe('log');
  });

  it('treats a clock that steps backwards as a new window rather than freezing', () => {
    const t = throttle(1);
    t.admit('none|edge', 'a', T0);
    expect(t.admit('none|edge', 'a', T0 - 1).action).toBe('log');
  });
});
