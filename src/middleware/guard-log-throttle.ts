/**
 * Bounded once-per-window throttle for guard decision log lines.
 *
 * A guard that logs every refused or would-refuse access floods the log for a
 * caller that repeats one query all day, so each distinct caller key is logged
 * once per window. The key has to carry caller-supplied values (operation
 * name, user agent, `X-Forwarded-For`) because those are what tell two callers
 * behind one edge address apart. That makes the key space caller-controlled:
 * a caller rotating any of those values mints a new key per request. An
 * unbounded map then grows until something clears it, and clearing a shared
 * map on size is worse than growth — one caller's rotation erases every other
 * caller's throttle state, so the flood re-logs everyone.
 *
 * So keys are counted per SCOPE — the principal kind plus the address this
 * process accepted the connection from, neither of which the caller can set in
 * a header — and each scope gets a fixed budget of distinct keys per window.
 * The first key past the budget yields one overflow notice for that scope;
 * later ones are dropped until the window ends. A caller rotating headers can
 * therefore spend its own scope's budget and nothing else: other scopes keep
 * their state, and the log volume per window is bounded by
 * `(maxScopes + 1) * (keysPerScope + 1)` whatever the caller sends. Scopes are
 * capped as well, because the connection address becomes caller-influenced if
 * `trust proxy` is ever widened; scopes past the cap share one overflow scope.
 *
 * State resets when a window elapses (a tumbling window), which is time-driven
 * and the same for every caller. The guard's counters are not throttled, so a
 * dropped line loses attribution for that window, never a count.
 *
 * @module middleware/guard-log-throttle
 */

/** Scope that every scope past `maxScopes` shares within a window. */
export const OVERFLOW_SCOPE = '<scope-overflow>';

/** Bounds for a {@link GuardLogThrottle}. */
export interface GuardLogThrottleOptions {
  /** Window length; a key is logged at most once per window. */
  windowMs: number;
  /** Distinct keys one scope may log per window. */
  keysPerScope: number;
  /** Distinct scopes tracked per window before new ones share one scope. */
  maxScopes: number;
}

/**
 * What the caller should do with one decision.
 *
 * - `log` — first time this key is seen in this scope this window.
 * - `overflow` — the scope has spent its budget this window; log one notice
 *   saying so, in place of the line.
 * - `drop` — already logged, or the scope's overflow notice is already out.
 */
export type GuardLogVerdict =
  | { action: 'log'; scope: string }
  | { action: 'overflow'; scope: string }
  | { action: 'drop' };

/** A bounded, windowed, per-scope once-per-key log throttle. */
export class GuardLogThrottle {
  private windowStartMs: number | undefined;

  private readonly keysByScope = new Map<string, Set<string>>();

  private readonly overflowedScopes = new Set<string>();

  constructor(private readonly options: GuardLogThrottleOptions) {}

  /**
   * Decide whether a decision for `key`, from `scope`, is logged.
   *
   * @param scope - Principal kind plus connection address; never a header.
   * @param key - The caller key within the scope.
   * @param nowMs - Current time.
   * @returns The verdict; the scope it names is the one that was charged.
   */
  admit(scope: string, key: string, nowMs: number): GuardLogVerdict {
    this.rollWindow(nowMs);

    const charged =
      this.keysByScope.has(scope) || this.keysByScope.size < this.options.maxScopes
        ? scope
        : OVERFLOW_SCOPE;
    let keys = this.keysByScope.get(charged);
    if (!keys) {
      keys = new Set<string>();
      this.keysByScope.set(charged, keys);
    }

    if (keys.has(key)) return { action: 'drop' };
    if (keys.size < this.options.keysPerScope) {
      keys.add(key);
      return { action: 'log', scope: charged };
    }
    if (this.overflowedScopes.has(charged)) return { action: 'drop' };
    this.overflowedScopes.add(charged);
    return { action: 'overflow', scope: charged };
  }

  /** Forget all state (tests). */
  reset(): void {
    this.windowStartMs = undefined;
    this.keysByScope.clear();
    this.overflowedScopes.clear();
  }

  /** Start a new window once the current one has elapsed (or the clock stepped back). */
  private rollWindow(nowMs: number): void {
    const start = this.windowStartMs;
    if (start !== undefined && nowMs >= start && nowMs - start < this.options.windowMs) return;
    this.windowStartMs = nowMs;
    this.keysByScope.clear();
    this.overflowedScopes.clear();
  }
}
