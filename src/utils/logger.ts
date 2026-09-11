type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  service: string;
  [key: string]: unknown;
}

interface Logger {
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
}

/**
 * Minimum-level filter, resolved once at module load from `LOG_LEVEL`.
 *
 * Default is `debug` — every call writes, byte-identical to the historical
 * unconditional behaviour, so production output is unchanged unless an
 * operator sets the variable. The test suite sets `LOG_LEVEL=error`
 * (vitest.config.ts): the codegen pipeline emits tens of thousands of
 * warn-level lines in-process, and under vitest that volume saturates the
 * worker IPC channel until the run fails with an unhandled
 * `[vitest-worker]: Timeout calling "onTaskUpdate"` even when every test
 * passes (observed on publish-gate runs 31244014211 / 31249917514).
 */
const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function resolveMinLevel(): LogLevel {
  const raw = process.env.LOG_LEVEL?.toLowerCase();
  if (raw === 'debug' || raw === 'info' || raw === 'warn' || raw === 'error') {
    return raw;
  }
  return 'debug';
}

const MIN_LEVEL_RANK = LEVEL_RANK[resolveMinLevel()];

function formatLogEntry(
  level: LogLevel,
  service: string,
  message: string,
  meta?: Record<string, unknown>
): string {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service,
    ...meta,
  };
  return JSON.stringify(entry);
}

function createLogger(service: string): Logger {
  const write = (
    level: LogLevel,
    stream: NodeJS.WriteStream,
    message: string,
    meta?: Record<string, unknown>
  ): void => {
    if (LEVEL_RANK[level] < MIN_LEVEL_RANK) return;
    stream.write(formatLogEntry(level, service, message, meta) + '\n');
  };
  return {
    info: (message, meta): void => write('info', process.stdout, message, meta),
    warn: (message, meta): void => write('warn', process.stdout, message, meta),
    error: (message, meta): void =>
      write('error', process.stderr, message, meta),
    debug: (message, meta): void =>
      write('debug', process.stdout, message, meta),
  };
}

export const logger = createLogger('backend-legacy');
