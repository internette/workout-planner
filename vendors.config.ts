// Features that rely on another company's service. Set each to true to offer it or false to turn it off, then redeploy.
//
// - google, apple: "Continue with Google" / "Continue with Apple" on the front door. Turning one off hides its button
//   and refuses sign-ins through it; if both are off, nobody can sign in.
// - claude, chatgpt: "Summon a plan" with that assistant. Turning one off drops it from the dialog and stops the
//   connector (/api/mcp) accepting its sign-ins; with both off, the button is gone and the connector answers 503.
//   ChatGPT also needs NEXT_PUBLIC_CHATGPT_OAUTH_CLIENT_ID (see the README).
const vendors = {
  google: true,
  apple: true,
  claude: true,
  chatgpt: true,
};

export default vendors;
