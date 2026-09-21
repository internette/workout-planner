// Server only. Removes a person's sign-in from Auth0 with the Management API, which the app's own login credentials
// cannot do. It needs a separate Machine-to-Machine application that is allowed the "delete:users" scope (see the README).

const domain = () => (process.env.AUTH0_DOMAIN ?? '').replace(/^https?:\/\//, '').replace(/\/$/, '');

/** Whether the Management API credentials are set. Without them an account cannot be fully deleted. */
export const MANAGEMENT_CONFIGURED = () =>
  !!(process.env.AUTH0_MANAGEMENT_CLIENT_ID && process.env.AUTH0_MANAGEMENT_CLIENT_SECRET && domain());

async function managementToken(): Promise<string> {
  const res = await fetch(`https://${domain()}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
      client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
      audience: `https://${domain()}/api/v2/`,
    }),
  });
  if (!res.ok) throw new Error(`Auth0 refused the management credentials (${res.status})`);
  return ((await res.json()) as { access_token: string }).access_token;
}

/** Deletes the user, and everything Auth0 holds about them. A user that is already gone counts as deleted. */
export async function deleteAuth0User(sub: string): Promise<void> {
  const token = await managementToken();
  const res = await fetch(`https://${domain()}/api/v2/users/${encodeURIComponent(sub)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 404) throw new Error(`Auth0 could not delete the user (${res.status})`);
}
