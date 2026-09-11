/**
 * The scrape endpoint can be closed without breaking whoever scrapes it today.
 *
 * `/metrics` on this service answers unauthenticated and returns 1.5 MB
 * describing the whole operational posture — request volumes, error rates, and
 * the authorization counters that reveal the checker is running in shadow. It is
 * mounted outside Apollo and outside auth deliberately, with the intent that the
 * ingress restrict it; that has not happened.
 *
 * So the gate is INERT until an operator sets a token. Deploying it changes
 * nothing, which is what makes it safe to deploy before anyone has decided.
 */
import { describe, it, expect } from 'vitest';

import { scrapeAuthorized } from '../config/metrics';

const TOKEN = 'a-scrape-token-value';

describe('with no token configured', () => {
  it('serves every scrape exactly as it does today', () => {
    expect(scrapeAuthorized(undefined, null)).toBe(true);
    expect(scrapeAuthorized('Bearer anything', null)).toBe(true);
    expect(scrapeAuthorized('', null)).toBe(true);
  });
});

describe('with a token configured', () => {
  it('admits the right bearer', () => {
    expect(scrapeAuthorized(`Bearer ${TOKEN}`, TOKEN)).toBe(true);
  });

  it('refuses an anonymous scrape', () => {
    expect(scrapeAuthorized(undefined, TOKEN)).toBe(false);
    expect(scrapeAuthorized('', TOKEN)).toBe(false);
  });

  it('refuses a wrong bearer of the same length', () => {
    expect(TOKEN).toHaveLength('a-scrape-token-WRONG'.length);
    expect(scrapeAuthorized('Bearer a-scrape-token-WRONG', TOKEN)).toBe(false);
  });

  it('refuses a bearer of a different length', () => {
    expect(scrapeAuthorized('Bearer x', TOKEN)).toBe(false);
    expect(scrapeAuthorized(`Bearer ${TOKEN}extra`, TOKEN)).toBe(false);
  });

  it('refuses another scheme carrying the right value', () => {
    expect(scrapeAuthorized(`Basic ${TOKEN}`, TOKEN)).toBe(false);
    expect(scrapeAuthorized(TOKEN, TOKEN)).toBe(false);
  });

  it('is case-sensitive on the scheme, as the header grammar requires here', () => {
    expect(scrapeAuthorized(`bearer ${TOKEN}`, TOKEN)).toBe(false);
  });
});
