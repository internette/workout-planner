import { createPublicKey, verify, type JsonWebKey } from 'crypto';

// Who is calling the connector. Claude signs the person in with Moonshot's Auth0 tenant (OAuth), then sends the Auth0
// access token it got on every request. This checks that token: signed by the tenant, for this connector, and not
// expired. Server only.

/** The connector's own address, which its tokens must name as their audience (the Auth0 API's identifier). */
export const mcpResource = () =>
  process.env.MCP_RESOURCE_URL || `${(process.env.APP_BASE_URL || '').replace(/\/$/, '')}/api/mcp`;

/** Auth0's issuer: "https://<tenant>/", as its tokens write it. */
export const auth0Issuer = () => `https://${(process.env.AUTH0_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, '')}/`;

export const MCP_CONFIGURED = () => !!process.env.AUTH0_DOMAIN && !!process.env.APP_BASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

// The tenant's signing keys, kept for ten minutes. A token signed with a key we don't have yet fetches them again.
let keys: { at: number; jwks: (JsonWebKey & { kid?: string })[] } | null = null;
async function signingKey(kid: string, fresh = false): Promise<JsonWebKey | null> {
  if (fresh || !keys || Date.now() - keys.at > 10 * 60_000) {
    const res = await fetch(`${auth0Issuer()}.well-known/jwks.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Could not fetch Auth0's signing keys (${res.status})`);
    keys = { at: Date.now(), jwks: ((await res.json()) as { keys: (JsonWebKey & { kid?: string })[] }).keys };
  }
  const hit = keys.jwks.find((k) => k.kid === kid);
  if (!hit && !fresh) return signingKey(kid, true);
  return hit ?? null;
}

const decode = (part: string) => JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));

/** The Auth0 user id ("google-oauth2|1234") the token was issued to, or null if the token isn't good for this connector. */
export async function verifyAccessToken(token: string): Promise<string | null> {
  try {
    const [h, p, s] = token.split('.');
    if (!h || !p || !s) return null;
    const header = decode(h) as { alg?: string; kid?: string };
    if (header.alg !== 'RS256' || !header.kid) return null;
    const jwk = await signingKey(header.kid);
    if (!jwk) return null;
    const good = verify('RSA-SHA256', Buffer.from(`${h}.${p}`), createPublicKey({ key: jwk, format: 'jwk' }), Buffer.from(s, 'base64url'));
    if (!good) return null;

    const claims = decode(p) as { iss?: string; aud?: string | string[]; exp?: number; nbf?: number; sub?: string };
    const now = Date.now() / 1000;
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (claims.iss !== auth0Issuer()) return null;
    if (!audiences.includes(mcpResource())) return null;
    if (typeof claims.exp !== 'number' || claims.exp < now - 30) return null;
    if (typeof claims.nbf === 'number' && claims.nbf > now + 30) return null;
    return typeof claims.sub === 'string' && claims.sub ? claims.sub : null;
  } catch (e) {
    console.error('Connector token check failed:', e instanceof Error ? e.message : e);
    return null;
  }
}
