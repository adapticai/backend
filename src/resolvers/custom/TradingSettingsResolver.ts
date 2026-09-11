import * as TypeGraphQL from 'type-graphql';
import * as GraphQLScalars from 'graphql-scalars';
import type { PrismaClient, Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { getPrismaFromContext } from '../../generated/typegraphql-prisma/helpers';
import type { BackendPrincipal } from '../../auth/token-verifier';

/**
 * Institutional trading settings — the org→fund policy-resolution layer.
 *
 * Trading settings are configured at two levels and stored as JSON blobs on the
 * owning rows: organization defaults (`Organization.tradingDefaults`) and
 * per-fund overrides (`Fund.tradingOverrides`). The effective settings resolve
 * `fundOverride ?? orgDefault` field-by-field; the SYSTEM-default layer is owned
 * by the engine/client at runtime (the platform layers its own
 * `SYSTEM_TRADING_DEFAULTS`), so this API returns only what is explicitly stored
 * — an unset field is `null`, never a fabricated default.
 *
 * All fields are nullable: a settings object carries only the keys an operator
 * has actually set. Updates are partial merges — a field absent from the input
 * leaves the stored value untouched.
 */

/** The 20 trading-settings field keys, in the platform's fragment order. */
const TRADING_SETTINGS_KEYS = [
  'realTime',
  'marketOpen',
  'tradeAllocationPct',
  'minPercentageChange',
  'volumeThreshold',
  'autoAllocation',
  'allocation',
  'cryptoTradingEnabled',
  'cryptoTradingPairs',
  'cryptoTradeAllocationPct',
  'enablePortfolioTrailingStop',
  'portfolioTrailPercent',
  'portfolioProfitThresholdPercent',
  'reducedPortfolioTrailPercent',
  'defaultTrailingStopPercentage100',
  'firstTrailReductionThreshold100',
  'secondTrailReductionThreshold100',
  'firstReducedTrailPercentage100',
  'secondReducedTrailPercentage100',
  'minimumPriceChangePercent100',
] as const;

/** A plain trading-settings record as stored/merged (all keys optional). */
type SettingsRecord = Record<string, unknown>;

/** Institutional trading settings (all fields optional; unset ⇒ null). */
@TypeGraphQL.ObjectType('TradingSettings', {})
export class TradingSettings {
  @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
  realTime?: boolean | null;

  @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
  marketOpen?: boolean | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  tradeAllocationPct?: number | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  minPercentageChange?: number | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  volumeThreshold?: number | null;

  @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
  autoAllocation?: boolean | null;

  @TypeGraphQL.Field((_type) => GraphQLScalars.JSONResolver, { nullable: true })
  allocation?: Prisma.JsonValue | null;

  @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
  cryptoTradingEnabled?: boolean | null;

  @TypeGraphQL.Field((_type) => [String], { nullable: true })
  cryptoTradingPairs?: string[] | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  cryptoTradeAllocationPct?: number | null;

  @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
  enablePortfolioTrailingStop?: boolean | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  portfolioTrailPercent?: number | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  portfolioProfitThresholdPercent?: number | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  reducedPortfolioTrailPercent?: number | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  defaultTrailingStopPercentage100?: number | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  firstTrailReductionThreshold100?: number | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  secondTrailReductionThreshold100?: number | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  firstReducedTrailPercentage100?: number | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  secondReducedTrailPercentage100?: number | null;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  minimumPriceChangePercent100?: number | null;
}

/** Partial trading-settings patch for org-default / fund-override updates. */
@TypeGraphQL.InputType('TradingSettingsInput', {})
export class TradingSettingsInput {
  @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
  realTime?: boolean;

  @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
  marketOpen?: boolean;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  tradeAllocationPct?: number;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  minPercentageChange?: number;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  volumeThreshold?: number;

  @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
  autoAllocation?: boolean;

  @TypeGraphQL.Field((_type) => GraphQLScalars.JSONResolver, { nullable: true })
  allocation?: Prisma.InputJsonValue;

  @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
  cryptoTradingEnabled?: boolean;

  @TypeGraphQL.Field((_type) => [String], { nullable: true })
  cryptoTradingPairs?: string[];

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  cryptoTradeAllocationPct?: number;

  @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
  enablePortfolioTrailingStop?: boolean;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  portfolioTrailPercent?: number;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  portfolioProfitThresholdPercent?: number;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  reducedPortfolioTrailPercent?: number;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  defaultTrailingStopPercentage100?: number;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  firstTrailReductionThreshold100?: number;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  secondTrailReductionThreshold100?: number;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  firstReducedTrailPercentage100?: number;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  secondReducedTrailPercentage100?: number;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Float, { nullable: true })
  minimumPriceChangePercent100?: number;
}

/** Result of an org-defaults update: the org plus its resolved defaults. */
@TypeGraphQL.ObjectType('OrgTradingDefaultsPayload', {})
export class OrgTradingDefaultsPayload {
  @TypeGraphQL.Field((_type) => String, { nullable: false })
  id!: string;

  @TypeGraphQL.Field((_type) => String, { nullable: false })
  name!: string;

  @TypeGraphQL.Field((_type) => TradingSettings, { nullable: true })
  tradingDefaults?: TradingSettings | null;
}

/** Result of a fund-overrides update: the fund plus its resolved overrides. */
@TypeGraphQL.ObjectType('FundTradingOverridesPayload', {})
export class FundTradingOverridesPayload {
  @TypeGraphQL.Field((_type) => String, { nullable: false })
  id!: string;

  @TypeGraphQL.Field((_type) => String, { nullable: false })
  name!: string;

  @TypeGraphQL.Field((_type) => TradingSettings, { nullable: true })
  tradingOverrides?: TradingSettings | null;
}

/** GraphQL resolver context carrying the Prisma client. */
interface GraphQLContext {
  prisma: PrismaClient;
  /**
   * The verified caller, as `server.ts` puts it on the context: `null` for an
   * unauthenticated request. This resolver previously declared only `prisma`
   * and therefore never asked who was calling — which left both mutations
   * writing any organisation's or fund's trading configuration for anyone who
   * could reach `/graphql`.
   */
  principal?: BackendPrincipal | null;
}

/** Org roles entitled to configure how a fund trades. */
const TRADING_CONFIG_ROLES: readonly string[] = [
  'OWNER',
  'ADMIN',
  'PORTFOLIO_MANAGER',
];

/**
 * Fail closed unless the caller may configure trading for `orgId`.
 *
 * Service and admin principals pass; a user principal must hold a membership in
 * that organisation with a role that owns trading configuration. An absent
 * principal is refused outright.
 *
 * This check does NOT rely on the `@Authorized()` auth-checker, which is
 * deliberately shadow-first (`CORTEX_AUTHCHECKER_ENFORCE` off ⇒ a would-deny is
 * logged and then allowed). A write that reconfigures how real money is traded
 * cannot wait for that graduation.
 */
async function assertCanConfigureTrading(
  prisma: PrismaClient,
  principal: BackendPrincipal | null | undefined,
  orgId: string
): Promise<void> {
  if (!principal) {
    throw new GraphQLError('Authentication required.', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  if (principal.kind === 'server' || principal.kind === 'admin') {
    return;
  }
  const membership = await prisma.orgMembership.findFirst({
    where: { organizationId: orgId, userId: principal.sub },
    select: { role: true },
  });
  if (!membership || !TRADING_CONFIG_ROLES.includes(String(membership.role))) {
    throw new GraphQLError(
      'Not entitled to configure trading for this organization.',
      { extensions: { code: 'FORBIDDEN' } }
    );
  }
}

/**
 * Coerce a stored JSON settings blob into a plain record, dropping any
 * non-object value (a corrupt/legacy scalar) to an empty record so callers
 * always see a well-formed settings object.
 */
function toSettingsRecord(
  value: Prisma.JsonValue | null | undefined
): SettingsRecord {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as SettingsRecord;
  }
  return {};
}

/**
 * Project a settings record onto exactly the known trading-settings keys,
 * dropping any stray keys. Present keys keep their stored value (including an
 * explicit `null`); absent keys are omitted so GraphQL resolves them to `null`.
 */
function projectSettings(record: SettingsRecord): SettingsRecord {
  const out: SettingsRecord = {};
  for (const key of TRADING_SETTINGS_KEYS) {
    if (key in record) {
      out[key] = record[key];
    }
  }
  return out;
}

/**
 * Merge a partial input patch onto an existing settings record. Only keys
 * actually supplied in the patch (value !== undefined) overwrite; every other
 * stored value is preserved. Returns a plain JSON-serialisable record.
 */
function mergeSettings(
  existing: SettingsRecord,
  patch: TradingSettingsInput
): SettingsRecord {
  const merged: SettingsRecord = { ...projectSettings(existing) };
  for (const key of TRADING_SETTINGS_KEYS) {
    const next = (patch as SettingsRecord)[key];
    if (next !== undefined) {
      merged[key] = next;
    }
  }
  return merged;
}

/**
 * Custom resolver implementing the org→fund trading-settings policy layer over
 * `Organization.tradingDefaults` and `Fund.tradingOverrides`.
 */
@TypeGraphQL.Resolver()
export class TradingSettingsResolver {
  /** Organization-level trading defaults (the stored blob; unset ⇒ null). */
  @TypeGraphQL.Query((_returns) => TradingSettings, {
    nullable: true,
    description: 'Organization-level trading defaults (unset fields are null).',
  })
  async organizationTradingDefaults(
    @TypeGraphQL.Arg('orgId', (_type) => String) orgId: string,
    @TypeGraphQL.Ctx() ctx: GraphQLContext
  ): Promise<TradingSettings> {
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { tradingDefaults: true },
    });
    return projectSettings(
      toSettingsRecord(org?.tradingDefaults)
    ) as TradingSettings;
  }

  /**
   * Effective settings for an org (and optional fund): `fundOverride ??
   * orgDefault` field-by-field. Unset fields are null — the system-default
   * layer is applied by the runtime/client, not fabricated here.
   */
  @TypeGraphQL.Query((_returns) => TradingSettings, {
    nullable: true,
    description:
      'Effective trading settings: fund override takes precedence over org default, field by field.',
  })
  async effectiveTradingSettings(
    @TypeGraphQL.Arg('orgId', (_type) => String) orgId: string,
    @TypeGraphQL.Ctx() ctx: GraphQLContext,
    @TypeGraphQL.Arg('fundId', (_type) => String, { nullable: true })
    fundId?: string
  ): Promise<TradingSettings> {
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    const [org, fund] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: orgId },
        select: { tradingDefaults: true },
      }),
      fundId
        ? prisma.fund.findUnique({
            where: { id: fundId },
            select: { tradingOverrides: true },
          })
        : Promise.resolve(null),
    ]);
    const orgDefaults = projectSettings(toSettingsRecord(org?.tradingDefaults));
    const fundOverrides = projectSettings(
      toSettingsRecord(fund?.tradingOverrides)
    );
    const effective: SettingsRecord = {};
    for (const key of TRADING_SETTINGS_KEYS) {
      const fundVal = fundOverrides[key];
      effective[key] =
        fundVal !== undefined && fundVal !== null ? fundVal : orgDefaults[key];
    }
    return effective as TradingSettings;
  }

  /** Merge a partial patch into the org's stored trading defaults. */
  @TypeGraphQL.Mutation((_returns) => OrgTradingDefaultsPayload, {
    nullable: false,
    description:
      'Update (partial-merge) the organization-level trading defaults.',
  })
  async updateOrgTradingDefaults(
    @TypeGraphQL.Arg('orgId', (_type) => String) orgId: string,
    @TypeGraphQL.Arg('settings', (_type) => TradingSettingsInput)
    settings: TradingSettingsInput,
    @TypeGraphQL.Ctx() ctx: GraphQLContext
  ): Promise<OrgTradingDefaultsPayload> {
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    await assertCanConfigureTrading(prisma, ctx.principal, orgId);
    const existing = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { tradingDefaults: true },
    });
    if (!existing) {
      throw new Error(`Organization ${orgId} not found`);
    }
    const merged = mergeSettings(
      toSettingsRecord(existing.tradingDefaults),
      settings
    );
    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: { tradingDefaults: merged as Prisma.InputJsonValue },
      select: { id: true, name: true, tradingDefaults: true },
    });
    return {
      id: updated.id,
      name: updated.name,
      tradingDefaults: projectSettings(
        toSettingsRecord(updated.tradingDefaults)
      ) as TradingSettings,
    };
  }

  /** Merge a partial patch into the fund's stored trading overrides. */
  @TypeGraphQL.Mutation((_returns) => FundTradingOverridesPayload, {
    nullable: false,
    description: 'Update (partial-merge) the fund-level trading overrides.',
  })
  async updateFundTradingOverrides(
    @TypeGraphQL.Arg('fundId', (_type) => String) fundId: string,
    @TypeGraphQL.Arg('settings', (_type) => TradingSettingsInput)
    settings: TradingSettingsInput,
    @TypeGraphQL.Ctx() ctx: GraphQLContext
  ): Promise<FundTradingOverridesPayload> {
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    const existing = await prisma.fund.findUnique({
      where: { id: fundId },
      select: { tradingOverrides: true, organizationId: true },
    });
    if (!existing) {
      throw new Error(`Fund ${fundId} not found`);
    }
    await assertCanConfigureTrading(prisma, ctx.principal, existing.organizationId);
    const merged = mergeSettings(
      toSettingsRecord(existing.tradingOverrides),
      settings
    );
    const updated = await prisma.fund.update({
      where: { id: fundId },
      data: { tradingOverrides: merged as Prisma.InputJsonValue },
      select: { id: true, name: true, tradingOverrides: true },
    });
    return {
      id: updated.id,
      name: updated.name,
      tradingOverrides: projectSettings(
        toSettingsRecord(updated.tradingOverrides)
      ) as TradingSettings,
    };
  }
}
