/**
 * The stored credential columns, by Prisma model.
 *
 * One vocabulary for every place that has to know what a credential is: the
 * credential-field guard (what may be read, filtered or grouped on), the
 * redaction applied to audit payloads on write, and the redaction applied to
 * audit payloads on read. It lives in a module that imports nothing, so each
 * of those can depend on it without depending on the others.
 *
 * @module auth/credential-fields
 */

/**
 * Every stored credential column, by Prisma model. A column belongs here when
 * its value lets the holder act as someone: a broker or vendor API secret, an
 * OAuth access / refresh / id token, a session token, a one-time verification
 * or invite token.
 */
export const CREDENTIAL_FIELDS: ReadonlyMap<string, ReadonlySet<string>> = new Map<
  string,
  ReadonlySet<string>
>([
  ['AlpacaAccount', new Set(['APIKey', 'APISecret'])],
  ['BrokerageAccount', new Set(['apiKey', 'apiSecret'])],
  [
    'LlmConfiguration',
    new Set([
      'openaiApiKey',
      'anthropicApiKey',
      'deepseekApiKey',
      'kimiApiKey',
      'qwenApiKey',
      'xaiApiKey',
      'geminiApiKey',
      'deepinfraApiKey',
    ]),
  ],
  ['User', new Set(['openaiAPIKey'])],
  ['Account', new Set(['refresh_token', 'access_token', 'id_token'])],
  ['LinkedProvider', new Set(['accessToken', 'refreshToken'])],
  ['Session', new Set(['sessionToken'])],
  ['VerificationToken', new Set(['token'])],
  ['AccountLinkingRequest', new Set(['verificationToken'])],
  ['InviteToken', new Set(['token'])],
]);
