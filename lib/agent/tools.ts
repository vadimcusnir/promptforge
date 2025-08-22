type Capability = "HTTP_FETCH" | "STORAGE_WRITE" | "RUN_TEST" | "EXPORT_BUNDLE";

export type ToolContext = {
  orgId: string;
  runId: string;
  caps: Capability[]; // runtime input derivat din entitlements + ruleset.yml
  allowHttp: string[]; // allowlist domenii
};

export async function httpFetch(
  ctx: ToolContext,
  url: string,
  init?: RequestInit,
) {
  if (!ctx.caps.includes("HTTP_FETCH"))
    throw new Error("CAPABILITY_DENIED:HTTP_FETCH");
  const allowed = ctx.allowHttp.some((d) => url.startsWith(`https://${d}`));
  if (!allowed) throw new Error("DOMAIN_DENIED");
  const res = await fetch(url, { ...init, redirect: "error" }); // fără redirects funky
  return res;
}
