/**
 * A metric label must be bounded by this application's schema, never by what a
 * client asks for.
 *
 * `/metrics` on this service is world-readable, and the route label was derived
 * from `req.path` whenever no route matched. Every unmatched path a scanner
 * probed became a new permanent time series: production carried 679 distinct
 * route values, 130 of them probes such as `/wp-config.php` and
 * `/@fs/proc/self/cwd/.config/gcloud/application_default_credentials.json`.
 * That is unbounded cardinality at the caller's discretion, which is a memory
 * exhaustion vector rather than an observability nicety.
 */
import { describe, it, expect } from 'vitest';
import type { Request } from 'express';

import { UNMATCHED_ROUTE_LABEL, routeLabel } from '../config/metrics';

/** A request that matched the given route pattern, or nothing. */
function requestWith(matched: string | undefined): Pick<Request, 'route'> {
  return (matched === undefined ? {} : { route: { path: matched } }) as Pick<Request, 'route'>;
}

describe('routeLabel', () => {
  it('uses the matched route PATTERN, which the routing table bounds', () => {
    expect(routeLabel(requestWith('/api/v1/investors/:id'))).toBe('/api/v1/investors/:id');
    expect(routeLabel(requestWith('/graphql'))).toBe('/graphql');
  });

  it('collapses an unmatched request to one bucket, never the requested path', () => {
    expect(routeLabel(requestWith(undefined))).toBe(UNMATCHED_ROUTE_LABEL);
  });

  it.each([
    '/wp-config.php',
    '/.git/HEAD',
    '/phpinfo.php',
    '/@fs/proc/self/cwd/.config/gcloud/application_default_credentials.json',
    '/../../etc/passwd',
  ])('records no series for the probe %s', (probe) => {
    // A probe never matches a route, so it must never reach the label. If it
    // did, one scanner would mint a series per path it tried.
    const label = routeLabel(requestWith(undefined));
    expect(label).toBe(UNMATCHED_ROUTE_LABEL);
    expect(label).not.toContain(probe);
  });

  it('is bounded: any number of distinct unmatched requests yield one value', () => {
    const labels = new Set(
      Array.from({ length: 500 }, () => routeLabel(requestWith(undefined))),
    );
    expect(labels.size).toBe(1);
  });

  it('treats an empty or non-string pattern as unmatched rather than as a label', () => {
    expect(routeLabel(requestWith(''))).toBe(UNMATCHED_ROUTE_LABEL);
    expect(routeLabel({ route: { path: 42 } } as unknown as Pick<Request, 'route'>)).toBe(
      UNMATCHED_ROUTE_LABEL,
    );
  });
});
