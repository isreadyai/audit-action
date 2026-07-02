#!/usr/bin/env node
// @bun

// apps/cli/src/ci-upload.ts
import { appendFileSync, readFileSync } from "fs";
function warn(message) {
  console.log(`::warning::${message}`);
}
function fail(message) {
  console.log(`::error::${message}`);
  process.exit(1);
}
function requireEnv(name) {
  const value = process.env[name];
  return value !== undefined && value.length > 0 ? value : null;
}
async function mintOidcToken(audience) {
  const requestUrl = requireEnv("ACTIONS_ID_TOKEN_REQUEST_URL");
  const requestToken = requireEnv("ACTIONS_ID_TOKEN_REQUEST_TOKEN");
  if (requestUrl === null || requestToken === null) {
    return null;
  }
  const res = await fetch(`${requestUrl}&audience=${encodeURIComponent(audience)}`, {
    headers: { authorization: `Bearer ${requestToken}` }
  }).catch(() => null);
  if (res === null || !res.ok) {
    return null;
  }
  const data = await res.json().catch(() => null);
  return data?.value ?? null;
}
function setOutput(name, value) {
  const out = process.env.GITHUB_OUTPUT;
  if (out !== undefined) {
    appendFileSync(out, `${name}=${value}
`);
  }
}
var apiKey = requireEnv("ISREADYAI_API_KEY");
var reportPath = requireEnv("REPORT_PATH");
var repositoryId = requireEnv("GH_REPOSITORY_ID");
var ownerRepo = requireEnv("GH_REPOSITORY");
var branch = requireEnv("GH_REF_NAME") ?? "main";
var commit = requireEnv("GH_SHA") ?? "unknown";
var apiUrl = process.env.ISREADYAI_API_URL ?? "https://isready.ai";
if (apiKey === null || reportPath === null || repositoryId === null || ownerRepo === null) {
  warn("isready CI upload skipped \u2014 missing api-key or GitHub context");
  process.exit(0);
}
var report;
try {
  report = JSON.parse(readFileSync(reportPath, "utf8"));
} catch {
  warn(`isready CI upload skipped \u2014 could not read the scan report at ${reportPath}`);
  process.exit(0);
}
var url = report.finalUrl ?? report.primary?.finalUrl ?? "";
var oidcToken = await mintOidcToken(apiUrl);
if (oidcToken === null) {
  warn("isready CI upload skipped \u2014 no GitHub OIDC token. Grant the job `permissions: id-token: write` so isready.ai can verify repository ownership.");
  process.exit(0);
}
var response = await fetch(`${apiUrl}/api/ci-report`, {
  method: "POST",
  headers: {
    authorization: `Bearer ${apiKey}`,
    "content-type": "application/json",
    "x-github-oidc": oidcToken
  },
  body: JSON.stringify({ repositoryId, ownerRepo, branch, commit, url, report })
}).catch(() => null);
if (response === null) {
  warn(`isready CI upload failed \u2014 could not reach ${apiUrl} (transient). The scan gate is unaffected.`);
  process.exit(0);
}
if (response.status === 401) {
  fail("isready CI upload failed \u2014 the isready.ai API key is invalid or revoked. Regenerate it in the isready.ai dashboard (Settings \u2192 API keys) and update the ISREADYAI_API_KEY repository secret.");
}
if (response.status === 403) {
  const code = await response.json().then((body) => body.error).catch(() => {
    return;
  });
  if (code === "repo_ownership_not_verified") {
    fail("isready CI upload failed \u2014 repository ownership could not be verified. Grant the job `permissions: id-token: write` and make sure the workflow runs in the repository it registers.");
  }
  warn("isready CI upload skipped \u2014 the CI report + repo badge require a Pro or Team plan.");
  process.exit(0);
}
if (response.status >= 500) {
  warn(`isready CI upload failed \u2014 isready.ai returned HTTP ${response.status} (transient server error). The scan gate is unaffected.`);
  process.exit(0);
}
if (!response.ok) {
  warn(`isready CI upload failed \u2014 HTTP ${response.status}.`);
  process.exit(0);
}
var result = await response.json();
setOutput("badge", result.badgeMarkdown);
setOutput("report-url", result.reportUrl);
var summary = process.env.GITHUB_STEP_SUMMARY;
if (summary !== undefined) {
  const lines = [
    "",
    "## isready.ai \u2014 repo badge",
    "",
    `Branch \`${result.branch}\` \xB7 score ${result.score ?? "n/a"}/100`,
    "",
    "Add this to your README (stable across repo renames):",
    "",
    "```markdown",
    result.badgeMarkdown,
    "```",
    "",
    `[View full report](${result.reportUrl})`,
    ""
  ];
  appendFileSync(summary, `${lines.join(`
`)}
`);
}
console.log(`isready CI report uploaded \u2014 ${result.reportUrl}`);
