import { NextResponse } from 'next/server';
import { MCP_CONFIGURED, MCP_ON, verifyAccessToken, type Assistant } from '@/lib/mcp/auth';
import { callTool, INSTRUCTIONS, TOOLS } from '@/lib/mcp/tools';

// Moonshot's connector for Claude and ChatGPT: a Model Context Protocol server over Streamable HTTP. It's stateless, and each
// POST carries one JSON-RPC message (or a batch) and gets a JSON reply. Every request needs an Auth0 access token for
// this connector; without one the reply points Claude to the discovery document, and Claude signs the person in.

export const dynamic = 'force-dynamic';

const VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
const base = () => (process.env.APP_BASE_URL || '').replace(/\/$/, '');

type Rpc = { jsonrpc?: string; id?: string | number | null; method?: string; params?: any };
const result = (id: Rpc['id'], value: unknown) => ({ jsonrpc: '2.0', id, result: value });
const failure = (id: Rpc['id'], code: number, message: string) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });

function unauthorized() {
  return NextResponse.json(failure(null, -32001, 'Sign in to Moonshot to use this connector.'), {
    status: 401,
    headers: { 'WWW-Authenticate': `Bearer resource_metadata="${base()}/.well-known/oauth-protected-resource/api/mcp"` },
  });
}

async function handle(msg: Rpc, who: { sub: string; assistant: Assistant }) {
  switch (msg.method) {
    case 'initialize': {
      const asked = msg.params?.protocolVersion;
      return result(msg.id, {
        protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[1],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'moonshot', title: 'Moonshot', version: '1.0.0' },
        instructions: INSTRUCTIONS,
      });
    }
    case 'ping':
      return result(msg.id, {});
    case 'tools/list':
      return result(msg.id, { tools: TOOLS });
    case 'tools/call':
      return result(msg.id, await callTool(String(msg.params?.name ?? ''), msg.params?.arguments ?? {}, who.sub, who.assistant));
    default:
      return failure(msg.id, -32601, `Method not found: ${msg.method}`);
  }
}

export async function POST(request: Request) {
  if (!MCP_ON()) return NextResponse.json(failure(null, -32002, "Moonshot's connector is turned off."), { status: 503 });
  if (!MCP_CONFIGURED()) return NextResponse.json(failure(null, -32002, "Moonshot's connector isn't set up on this server."), { status: 503 });
  const token = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  const who = token ? await verifyAccessToken(token) : null;
  if (!who) return unauthorized();

  const body = await request.json().catch(() => undefined);
  if (body === undefined) return NextResponse.json(failure(null, -32700, 'Parse error'), { status: 400 });
  const messages: Rpc[] = Array.isArray(body) ? body : [body];
  // Notifications and responses (no method, or no id) get no reply of their own.
  const replies = await Promise.all(messages.filter((m) => m && m.method && m.id !== undefined && m.id !== null).map((m) => handle(m, who)));
  if (!replies.length) return new NextResponse(null, { status: 202 });
  return NextResponse.json(Array.isArray(body) ? replies : replies[0], { headers: { 'Cache-Control': 'no-store' } });
}

// No server-sent event stream and no sessions: the connector only answers requests.
export function GET() {
  return new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
}
export function DELETE() {
  return new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
}
