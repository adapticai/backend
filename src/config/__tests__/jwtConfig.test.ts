import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const SECRET = 'user-session-secret-for-jwt-config-suite-only-not-real';

async function loadSecret(): Promise<string> {
  vi.resetModules();
  return (await import('../jwtConfig')).jwtSecret;
}

describe('jwtConfig — secret normalisation', () => {
  const saved = {
    jwt: process.env.JWT_SECRET,
    next: process.env.NEXTAUTH_SECRET,
  };

  beforeEach(() => {
    delete process.env.NEXTAUTH_SECRET;
  });

  afterEach(() => {
    for (const [key, value] of [
      ['JWT_SECRET', saved.jwt],
      ['NEXTAUTH_SECRET', saved.next],
    ] as const) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it('trims a trailing newline so it matches the service-token reader', async () => {
    process.env.JWT_SECRET = `${SECRET}\n`;
    expect(await loadSecret()).toBe(SECRET);
  });

  it('trims NEXTAUTH_SECRET on the fallback path', async () => {
    delete process.env.JWT_SECRET;
    process.env.NEXTAUTH_SECRET = `  ${SECRET} `;
    expect(await loadSecret()).toBe(SECRET);
  });

  it('treats a whitespace-only JWT_SECRET as unset and falls back', async () => {
    process.env.JWT_SECRET = '   \n';
    process.env.NEXTAUTH_SECRET = SECRET;
    expect(await loadSecret()).toBe(SECRET);
  });
});
