import 'server-only';
import { NextResponse } from 'next/server';
import { auth0Issuer, mcpResource } from '@/backend/mcp/auth';

// OAuth protected-resource metadata (RFC 9728) for the connector: which address it is, and that Moonshot's Auth0 tenant
// signs people in for it. Served at /.well-known/oauth-protected-resource (and .../api/mcp) by the rewrite in
// next.config.js. Claude reads it after the connector's first 401.

export function GET() {
  return NextResponse.json(
    {
      resource: mcpResource(),
      authorization_servers: [auth0Issuer()],
      bearer_methods_supported: ['header'],
      scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
      resource_name: 'Moonshot',
    },
    { headers: { 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' } },
  );
}
