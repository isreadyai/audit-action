#!/usr/bin/env node
// @bun

// apps/cli/src/from-json.ts
import { readFile } from "fs/promises";

// packages/scanner/src/types.ts
var ECategory = {
  CRAWLER_ACCESS: "crawler_access",
  RENDERING: "rendering",
  STRUCTURED_DATA: "structured_data",
  TRUST: "trust",
  GEO_CONTENT: "geo_content"
};
var CATEGORY_LABELS = {
  [ECategory.CRAWLER_ACCESS]: "Crawler access",
  [ECategory.RENDERING]: "Rendering",
  [ECategory.STRUCTURED_DATA]: "Structured data",
  [ECategory.TRUST]: "Trust & security",
  [ECategory.GEO_CONTENT]: "Content (GEO)"
};
var EStatus = {
  PASS: "pass",
  WARN: "warn",
  FAIL: "fail",
  INFO: "info",
  ERROR: "error"
};
var ELevel = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high"
};
var ECheckScope = {
  SITE: "site",
  PAGE: "page"
};
var EGrade = {
  EXCELLENT: "excellent",
  GOOD: "good",
  MODERATE: "moderate",
  POOR: "poor"
};

// packages/scanner/src/checks/builder.ts
var DEFAULT_SCORES = {
  [EStatus.PASS]: 1,
  [EStatus.WARN]: 0.5,
  [EStatus.FAIL]: 0,
  [EStatus.INFO]: 1,
  [EStatus.ERROR]: 0
};
function defineCheck(def, run) {
  return { ...def, scope: def.scope ?? ECheckScope.PAGE, run };
}
function makeResult(def, status, detail, extra = {}) {
  return {
    id: def.id,
    category: def.category,
    status,
    score: extra.score ?? DEFAULT_SCORES[status],
    weight: def.weight,
    title: def.title,
    detail,
    evidence: extra.evidence,
    fix: extra.fix,
    impact: extra.impact,
    effort: extra.effort,
    docsUrl: extra.docsUrl
  };
}

// packages/scanner/src/util/robots.ts
function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  const warnings = [];
  let current = null;
  let lastWasAgent = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (line.length === 0) {
      continue;
    }
    const colon = line.indexOf(":");
    if (colon === -1) {
      warnings.push(`Line without directive: "${truncate(rawLine)}"`);
      continue;
    }
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    switch (field) {
      case "user-agent": {
        if (!lastWasAgent || current === null) {
          current = { agents: [], rules: [] };
          groups.push(current);
        }
        current.agents.push(value.toLowerCase());
        lastWasAgent = true;
        break;
      }
      case "allow":
      case "disallow": {
        if (current === null) {
          warnings.push(`Rule before any User-agent: "${truncate(rawLine)}"`);
          break;
        }
        current.rules.push({ type: field, path: value });
        lastWasAgent = false;
        break;
      }
      case "sitemap": {
        if (value.length > 0) {
          sitemaps.push(value);
        }
        lastWasAgent = false;
        break;
      }
      case "crawl-delay":
      case "host": {
        lastWasAgent = false;
        break;
      }
      default: {
        warnings.push(`Unknown directive "${field}"`);
        lastWasAgent = false;
      }
    }
  }
  return { groups, sitemaps, warnings };
}
function groupFor(robots, userAgent) {
  const ua = userAgent.toLowerCase();
  let best = null;
  let bestLen = -1;
  let star = null;
  for (const group of robots.groups) {
    for (const agent of group.agents) {
      if (agent === "*") {
        star ??= group;
        continue;
      }
      if (ua.includes(agent) && agent.length > bestLen) {
        best = group;
        bestLen = agent.length;
      }
    }
  }
  return best ?? star;
}
function isAllowed(robots, userAgent, path) {
  const group = groupFor(robots, userAgent);
  if (group === null) {
    return true;
  }
  let verdict = true;
  let bestLen = -1;
  for (const rule of group.rules) {
    if (rule.path.length === 0) {
      continue;
    }
    if (pathMatches(rule.path, path)) {
      const specificity = rule.path.replace(/\*/g, "").length;
      if (specificity > bestLen || specificity === bestLen && rule.type === "allow" && verdict === false) {
        verdict = rule.type === "allow";
        bestLen = specificity;
      }
    }
  }
  return verdict;
}
function isFullyBlocked(robots, userAgent) {
  return !isAllowed(robots, userAgent, "/");
}
function pathMatches(pattern, path) {
  const anchored = pattern.endsWith("$");
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const segments = body.split("*");
  const first = segments[0] ?? "";
  if (!path.startsWith(first)) {
    return false;
  }
  let pos = first.length;
  for (let i = 1;i < segments.length - 1; i++) {
    const seg = segments[i];
    if (!seg) {
      continue;
    }
    const at = path.indexOf(seg, pos);
    if (at === -1) {
      return false;
    }
    pos = at + seg.length;
  }
  if (segments.length === 1) {
    return anchored ? pos === path.length : true;
  }
  const last = segments[segments.length - 1] ?? "";
  if (anchored) {
    return path.length - last.length >= pos && path.endsWith(last);
  }
  return last.length === 0 || path.indexOf(last, pos) !== -1;
}
function truncate(s) {
  return s.length > 60 ? `${s.slice(0, 57)}…` : s;
}

// packages/scanner/src/checks/crawler/robots-exists.ts
var def = {
  id: "crawler.robots.exists",
  category: ECategory.CRAWLER_ACCESS,
  weight: 2,
  title: "robots.txt is present and parseable",
  scope: ECheckScope.SITE
};
var DOCS = "https://developers.google.com/search/docs/crawling-indexing/robots/intro";
var robotsExistsCheck = defineCheck(def, async (ctx) => {
  const robotsUrl = new URL("/robots.txt", ctx.url).toString();
  const res = await ctx.fetchCached(robotsUrl);
  if (res.error !== undefined || res.status === 0) {
    return makeResult(def, EStatus.WARN, "Could not fetch robots.txt (network error).", {
      evidence: { url: robotsUrl, status: res.status, error: res.error },
      fix: "Ensure /robots.txt is reachable so crawlers can read your crawl directives and sitemap pointer.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      docsUrl: DOCS
    });
  }
  if (res.status >= 500) {
    return makeResult(def, EStatus.FAIL, `robots.txt returned ${res.status}; Google treats a 5xx robots.txt as "disallow all", blocking crawling site-wide.`, {
      evidence: { url: robotsUrl, status: res.status },
      fix: "Fix the server error on /robots.txt (return 200 with valid rules, or 404 if you have none). A persistent 5xx halts crawling.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS
    });
  }
  if (res.status === 404 || res.status >= 400) {
    return makeResult(def, EStatus.WARN, "No robots.txt (404). Crawlers default to allow-all, but you have no place to declare crawl rules or point to your sitemap.", {
      evidence: { url: robotsUrl, status: res.status },
      fix: "Add a /robots.txt (even a minimal allow-all with a Sitemap: line) to gain explicit control and surface your sitemap.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      docsUrl: DOCS
    });
  }
  const body = res.body.trim();
  if (body.length === 0) {
    return makeResult(def, EStatus.WARN, "robots.txt is empty.", {
      evidence: { url: robotsUrl, status: res.status },
      fix: "Populate /robots.txt with at least an allow-all group and a Sitemap: directive.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      docsUrl: DOCS
    });
  }
  const robots = parseRobots(res.body);
  return makeResult(def, EStatus.PASS, "robots.txt is present and parseable.", {
    evidence: {
      url: robotsUrl,
      status: res.status,
      groups: robots.groups.length,
      sitemaps: robots.sitemaps.length,
      warnings: robots.warnings
    },
    docsUrl: DOCS
  });
});

// packages/scanner/src/crawlers.ts
var ECrawlerPurpose = {
  TRAINING: "training",
  SEARCH: "search",
  USER: "user"
};
var AI_CRAWLERS = [
  {
    token: "GPTBot",
    operator: "OpenAI",
    purpose: "training",
    surface: "OpenAI model training",
    docsUrl: "https://platform.openai.com/docs/bots"
  },
  {
    token: "OAI-SearchBot",
    operator: "OpenAI",
    purpose: "search",
    surface: "ChatGPT Search",
    docsUrl: "https://platform.openai.com/docs/bots"
  },
  {
    token: "ChatGPT-User",
    operator: "OpenAI",
    purpose: "user",
    surface: "ChatGPT live browsing",
    docsUrl: "https://platform.openai.com/docs/bots"
  },
  {
    token: "ClaudeBot",
    operator: "Anthropic",
    purpose: "training",
    surface: "Claude model training",
    docsUrl: "https://support.anthropic.com/en/articles/8896518"
  },
  {
    token: "Claude-SearchBot",
    operator: "Anthropic",
    purpose: "search",
    surface: "Claude search",
    docsUrl: "https://support.anthropic.com/en/articles/8896518"
  },
  {
    token: "Claude-User",
    operator: "Anthropic",
    purpose: "user",
    surface: "Claude live fetch",
    docsUrl: "https://support.anthropic.com/en/articles/8896518"
  },
  {
    token: "Google-Extended",
    operator: "Google",
    purpose: "training",
    surface: "Gemini / Vertex AI training",
    docsUrl: "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers"
  },
  {
    token: "Googlebot",
    operator: "Google",
    purpose: "search",
    surface: "Google Search & AI Overviews",
    docsUrl: "https://developers.google.com/search/docs/crawling-indexing/googlebot"
  },
  {
    token: "PerplexityBot",
    operator: "Perplexity",
    purpose: "search",
    surface: "Perplexity answers",
    docsUrl: "https://docs.perplexity.ai/guides/bots"
  },
  {
    token: "Perplexity-User",
    operator: "Perplexity",
    purpose: "user",
    surface: "Perplexity live fetch",
    docsUrl: "https://docs.perplexity.ai/guides/bots"
  },
  {
    token: "Applebot",
    operator: "Apple",
    purpose: "search",
    surface: "Apple search / Siri",
    docsUrl: "https://support.apple.com/en-us/119829"
  },
  {
    token: "Applebot-Extended",
    operator: "Apple",
    purpose: "training",
    surface: "Apple AI training",
    docsUrl: "https://support.apple.com/en-us/119829"
  },
  {
    token: "Amazonbot",
    operator: "Amazon",
    purpose: "search",
    surface: "Alexa / Rufus",
    docsUrl: "https://developer.amazon.com/amazonbot"
  },
  {
    token: "Meta-ExternalAgent",
    operator: "Meta",
    purpose: "training",
    surface: "Meta AI training",
    docsUrl: "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers"
  },
  {
    token: "Bytespider",
    operator: "ByteDance",
    purpose: "training",
    surface: "ByteDance / TikTok AI",
    docsUrl: "https://support.bytespider.com"
  },
  {
    token: "CCBot",
    operator: "Common Crawl",
    purpose: "training",
    surface: "Common Crawl corpus",
    docsUrl: "https://commoncrawl.org/ccbot"
  },
  {
    token: "Bingbot",
    operator: "Microsoft",
    purpose: "search",
    surface: "Bing Search & Microsoft Copilot",
    docsUrl: "https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0"
  },
  {
    token: "MistralAI-User",
    operator: "Mistral",
    purpose: "user",
    surface: "Le Chat live fetch",
    docsUrl: "https://docs.mistral.ai/robots"
  },
  {
    token: "DuckAssistBot",
    operator: "DuckDuckGo",
    purpose: "search",
    surface: "DuckAssist AI answers",
    docsUrl: "https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot/"
  },
  {
    token: "Meta-ExternalFetcher",
    operator: "Meta",
    purpose: "user",
    surface: "Meta AI live fetch",
    docsUrl: "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers"
  },
  {
    token: "cohere-training-data-crawler",
    operator: "Cohere",
    purpose: "training",
    surface: "Cohere model training",
    docsUrl: "https://github.com/ai-robots-txt/ai.robots.txt"
  }
];
var PRIORITY_TOKENS = [
  "GPTBot",
  "OAI-SearchBot",
  "Bingbot",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended"
];

// packages/scanner/src/checks/crawler/robots-ai-bots.ts
var def2 = {
  id: "crawler.robots.ai-bots",
  category: ECategory.CRAWLER_ACCESS,
  weight: 5,
  title: "AI crawlers are allowed in robots.txt",
  scope: ECheckScope.SITE
};
var DOCS2 = "https://platform.openai.com/docs/bots";
var robotsAiBotsCheck = defineCheck(def2, async (ctx) => {
  const robotsUrl = new URL("/robots.txt", ctx.url).toString();
  const res = await ctx.fetchCached(robotsUrl);
  const hasRobots = res.error === undefined && res.status >= 200 && res.status < 400 && res.body.trim().length > 0;
  if (!hasRobots) {
    return makeResult(def2, EStatus.PASS, "No robots.txt rules block AI crawlers (allow-all by default).", {
      evidence: { url: robotsUrl, status: res.status, robotsPresent: false },
      docsUrl: DOCS2
    });
  }
  const robots = parseRobots(res.body);
  const verdicts = AI_CRAWLERS.map((c) => ({
    token: c.token,
    operator: c.operator,
    purpose: c.purpose,
    surface: c.surface,
    blocked: isFullyBlocked(robots, c.token)
  }));
  const priority = verdicts.filter((v) => PRIORITY_TOKENS.includes(v.token));
  const allowedPriority = priority.filter((v) => !v.blocked).length;
  const score = priority.length > 0 ? allowedPriority / priority.length : 1;
  const blocked = verdicts.filter((v) => v.blocked);
  const blockedSearchOrUser = blocked.filter((v) => PRIORITY_TOKENS.includes(v.token) && (v.purpose === ECrawlerPurpose.SEARCH || v.purpose === ECrawlerPurpose.USER));
  const blockedTrainingOnly = blocked.filter((v) => v.purpose === ECrawlerPurpose.TRAINING);
  const evidence = {
    url: robotsUrl,
    crawlers: verdicts,
    priorityAllowed: allowedPriority,
    priorityTotal: priority.length
  };
  if (blockedSearchOrUser.length > 0) {
    const surfaces = blockedSearchOrUser.map((v) => `${v.token} (${v.surface})`).join(", ");
    return makeResult(def2, EStatus.FAIL, `robots.txt fully blocks AI answer crawlers — you are removed from: ${surfaces}.`, {
      evidence,
      fix: `Remove the Disallow rules for these tokens (or add explicit Allow groups): ${blockedSearchOrUser.map((v) => v.token).join(", ")}. These power live AI search/answer surfaces, not just training.`,
      impact: ELevel.HIGH,
      effort: ELevel.LOW,
      score,
      docsUrl: DOCS2
    });
  }
  if (blockedTrainingOnly.length > 0) {
    const tokens = blockedTrainingOnly.map((v) => v.token).join(", ");
    return makeResult(def2, EStatus.WARN, `robots.txt blocks training-only crawlers (${tokens}). This is a legitimate policy choice; the consequence is your content won't be ingested into those models' training corpora (it remains readable by live search/answer crawlers).`, {
      evidence,
      fix: `If excluding your content from AI training is intentional, no action needed. To allow it, remove the Disallow rules for: ${tokens}.`,
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      score,
      docsUrl: DOCS2
    });
  }
  return makeResult(def2, EStatus.PASS, "All priority AI crawlers are allowed in robots.txt.", {
    evidence,
    score,
    docsUrl: DOCS2
  });
});

// packages/scanner/src/checks/crawler/anti-bot.ts
var def3 = {
  id: "crawler.anti-bot",
  category: ECategory.CRAWLER_ACCESS,
  weight: 5,
  title: "No anti-bot challenge blocks crawlers",
  scope: ECheckScope.SITE
};
var DOCS3 = "https://developers.cloudflare.com/bots/concepts/ai-crawl-control/";
var CF_CHALLENGE_MARKERS = ["_cf_chl_opt", "cf-browser-verification"];
var CF_CHALLENGE_TITLES = ["just a moment", "attention required! | cloudflare"];
var CF_FIX = "Allowlist verified AI crawlers via Cloudflare AI Crawl Control (or your WAF) so GPTBot, ClaudeBot, PerplexityBot et al. are not served a JS challenge.";
var antiBotCheck = defineCheck(def3, (ctx) => {
  const { raw } = ctx;
  const headers = raw.headers;
  const body = raw.body.toLowerCase();
  const server = (headers["server"] ?? "").toLowerCase();
  const status = raw.status;
  const blockedNote = "A human browser may pass it, but AI crawlers (which do not execute the challenge) are almost certainly blocked too.";
  if ((headers["cf-mitigated"] ?? "").toLowerCase() === "challenge") {
    return fail(`Cloudflare is serving a managed challenge (cf-mitigated: challenge). ${blockedNote}`, {
      vendor: "Cloudflare",
      signal: "cf-mitigated: challenge",
      status
    });
  }
  if ((status === 403 || status === 503) && server.includes("cloudflare")) {
    return fail(`Cloudflare returned ${status} from its edge (server: cloudflare). ${blockedNote}`, {
      vendor: "Cloudflare",
      signal: `status ${status} + server: cloudflare`,
      status
    });
  }
  const title = /<title[^>]*>([^<]*)<\/title>/.exec(body)?.[1]?.trim() ?? "";
  const cfMarker = CF_CHALLENGE_MARKERS.find((sig) => body.includes(sig));
  const cfTitle = CF_CHALLENGE_TITLES.find((sig) => title.includes(sig));
  if (cfMarker !== undefined || cfTitle !== undefined) {
    return fail(`A Cloudflare anti-bot interstitial was detected in the response. ${blockedNote}`, {
      vendor: "Cloudflare",
      signal: cfMarker ?? `title: ${cfTitle}`,
      status
    });
  }
  const dataDomeHeader = Object.keys(headers).some((k) => k.includes("datadome"));
  if (status === 403 && (dataDomeHeader || body.includes("datadome"))) {
    return makeResult(def3, EStatus.FAIL, `DataDome is blocking the request (403). ${blockedNote}`, {
      evidence: {
        vendor: "DataDome",
        signal: dataDomeHeader ? "datadome header" : "datadome in body",
        status
      },
      fix: "Configure your DataDome policy to allowlist verified AI crawlers (GPTBot, ClaudeBot, PerplexityBot…) so they receive content rather than a block.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS3
    });
  }
  if (status === 403 && /reference #/i.test(raw.body)) {
    return makeResult(def3, EStatus.WARN, 'Akamai may be challenging the request (403 with an Akamai-style "Reference #" error). AI crawlers could be blocked.', {
      evidence: { vendor: "Akamai", signal: "reference #", status },
      fix: "Verify your Akamai bot-management policy allowlists legitimate AI crawlers; serve them content instead of a denial page.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS3
    });
  }
  if (status === 403) {
    return makeResult(def3, EStatus.WARN, "The site returned 403 Forbidden to the scanner. Some access control is rejecting non-browser clients; AI crawlers may be blocked too.", {
      evidence: { vendor: "unknown", signal: "generic 403", status },
      fix: "Check your WAF / server rules. Allow verified AI crawler user-agents and IP ranges instead of returning 403.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS3
    });
  }
  return makeResult(def3, EStatus.PASS, "No anti-bot challenge detected in the response.", {
    evidence: { status },
    docsUrl: DOCS3
  });
  function fail(detail, evidence) {
    return makeResult(def3, EStatus.FAIL, detail, {
      evidence,
      fix: CF_FIX,
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS3
    });
  }
});

// packages/scanner/src/checks/crawler/sitemap.ts
var def4 = {
  id: "crawler.sitemap",
  category: ECategory.CRAWLER_ACCESS,
  weight: 2,
  title: "XML sitemap is discoverable",
  scope: ECheckScope.SITE
};
var DOCS4 = "https://www.sitemaps.org/protocol.html";
var sitemapCheck = defineCheck(def4, async (ctx) => {
  const robotsUrl = new URL("/robots.txt", ctx.url).toString();
  const robotsRes = await ctx.fetchCached(robotsUrl);
  const robots = robotsRes.error === undefined && robotsRes.status >= 200 && robotsRes.status < 400 ? parseRobots(robotsRes.body) : null;
  const fromRobots = robots?.sitemaps[0];
  const sitemapUrl = fromRobots ?? new URL("/sitemap.xml", ctx.url).toString();
  const source = fromRobots !== undefined ? "robots.txt Sitemap directive" : "/sitemap.xml fallback";
  const res = await ctx.fetchCached(sitemapUrl);
  const found = res.error === undefined && res.status >= 200 && res.status < 300;
  if (!found) {
    return makeResult(def4, EStatus.WARN, "No XML sitemap found. Crawlers must discover every URL by following links, slowing and limiting AI indexing.", {
      evidence: {
        sitemapUrl,
        source,
        status: res.status,
        robotsSitemaps: robots?.sitemaps ?? []
      },
      fix: "Publish an XML sitemap and reference it with a Sitemap: line in robots.txt.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS4
    });
  }
  const body = res.body;
  if (!/<urlset|<sitemapindex/i.test(body)) {
    return makeResult(def4, EStatus.WARN, "A sitemap was served but is not valid XML (missing <urlset> / <sitemapindex>).", {
      evidence: { sitemapUrl, source, status: res.status, bodyPreview: body.slice(0, 120) },
      fix: "Serve a well-formed XML sitemap with a root <urlset> (or <sitemapindex>) element.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS4
    });
  }
  return makeResult(def4, EStatus.PASS, `XML sitemap found via ${source}.`, {
    evidence: { sitemapUrl, source, status: res.status },
    docsUrl: DOCS4
  });
});

// packages/scanner/src/checks/crawler/redirects.ts
var def5 = {
  id: "crawler.redirects",
  category: ECategory.CRAWLER_ACCESS,
  weight: 2,
  title: "Redirect chain is short",
  scope: ECheckScope.SITE
};
var DOCS5 = "https://developers.google.com/search/docs/crawling-indexing/301-redirects";
var redirectsCheck = defineCheck(def5, (ctx) => {
  const { raw } = ctx;
  const hops = raw.redirects;
  const chain = hops.map((h) => ({ from: h.url, status: h.status, to: h.location }));
  if (raw.error !== undefined && /redirect loop|redirects/i.test(raw.error)) {
    return makeResult(def5, EStatus.FAIL, `Redirects never resolve: ${raw.error}. Crawlers abandon the URL without ever reaching content.`, {
      evidence: { error: raw.error, hops: chain },
      fix: "Remove the redirect loop / excessive redirects so the URL resolves to a 200 in one or two hops.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS5
    });
  }
  if (hops.length >= 3) {
    return makeResult(def5, EStatus.WARN, `${hops.length} redirect hops before content. AI fetchers run on 1–5 s budgets, and each extra hop adds latency that can trip their timeout.`, {
      evidence: { hopCount: hops.length, hops: chain },
      fix: "Collapse the chain to a single redirect that points straight at the final URL.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS5
    });
  }
  const detail = hops.length === 0 ? "No redirects — the URL serves content directly." : `${hops.length} redirect hop${hops.length === 1 ? "" : "s"} (within the safe limit).`;
  return makeResult(def5, EStatus.PASS, detail, {
    evidence: { hopCount: hops.length, hops: chain },
    docsUrl: DOCS5
  });
});

// packages/scanner/src/checks/crawler/ttfb.ts
var def6 = {
  id: "crawler.ttfb",
  category: ECategory.CRAWLER_ACCESS,
  weight: 2,
  title: "Server responds quickly (TTFB)",
  scope: ECheckScope.SITE
};
var DOCS6 = "https://web.dev/articles/ttfb";
var ttfbCheck = defineCheck(def6, (ctx) => {
  const ttfb = ctx.raw.timing.ttfbMs;
  const score = Math.max(0, Math.min(1, (2000 - ttfb) / 1500));
  const evidence = { ttfbMs: ttfb };
  const note = "AI fetchers operate on short per-request timeouts (often 1–5 s), unlike Googlebot which tolerates slow servers.";
  if (ttfb <= 500) {
    return makeResult(def6, EStatus.PASS, `TTFB is ${ttfb} ms — fast.`, {
      evidence,
      score,
      docsUrl: DOCS6
    });
  }
  if (ttfb <= 1500) {
    return makeResult(def6, EStatus.WARN, `TTFB is ${ttfb} ms. ${note}`, {
      evidence,
      fix: "Reduce server response time (caching, CDN, faster origin) to keep TTFB under ~500 ms.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      score,
      docsUrl: DOCS6
    });
  }
  return makeResult(def6, EStatus.FAIL, `TTFB is ${ttfb} ms — too slow. ${note}`, {
    evidence,
    fix: "Cut TTFB well below 1.5 s via a CDN, edge caching, or origin optimization; slow responses get dropped by AI fetchers.",
    impact: ELevel.HIGH,
    effort: ELevel.MEDIUM,
    score,
    docsUrl: DOCS6
  });
});

// packages/scanner/src/util/html.ts
var TAG_RE = (tag) => new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
function htmlToText(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}
function wordCount(text) {
  if (text.length === 0) {
    return 0;
  }
  return text.split(/\s+/).filter(Boolean).length;
}
function extractTitle(html) {
  const match = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match?.[1]?.trim() ?? null;
}
function extractHtmlLangAttr(html) {
  const match = /<html\b[^>]*\blang=["']([^"']+)["']/i.exec(html);
  return match?.[1]?.trim() ?? null;
}
function extractMetaTags(html) {
  const tags = [];
  const re = /<meta\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] ?? "";
    tags.push({
      name: attr(attrs, "name"),
      property: attr(attrs, "property"),
      content: attr(attrs, "content")
    });
  }
  return tags;
}
function metaContent(tags, key) {
  const lowered = key.toLowerCase();
  const hit = tags.find((t) => t.name?.toLowerCase() === lowered || t.property?.toLowerCase() === lowered);
  return hit?.content;
}
function extractJsonLd(html) {
  const out = [];
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = (m[1] ?? "").trim();
    if (raw.length === 0) {
      continue;
    }
    try {
      out.push(JSON.parse(raw));
    } catch {}
  }
  return out;
}
function jsonLdTypes(blocks) {
  const types = new Set;
  const visit = (node) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node && typeof node === "object") {
      const obj = node;
      const t = obj["@type"];
      if (typeof t === "string") {
        types.add(t);
      } else if (Array.isArray(t)) {
        t.forEach((x) => typeof x === "string" && types.add(x));
      }
      if (Array.isArray(obj["@graph"])) {
        obj["@graph"].forEach(visit);
      }
    }
  };
  blocks.forEach(visit);
  return [...types];
}
function countTag(html, tag) {
  const matches = html.match(new RegExp(`<${tag}\\b`, "gi"));
  return matches ? matches.length : 0;
}
function tagTextContents(html, tag) {
  const out = [];
  const re = TAG_RE(tag);
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push(htmlToText(m[1] ?? ""));
  }
  return out;
}
function extractCanonical(html) {
  const re = /<link\b([^>]*\brel=["']canonical["'][^>]*)>/i;
  const m = re.exec(html);
  if (!m) {
    return null;
  }
  return attr(m[1] ?? "", "href") ?? null;
}
function hasHreflang(html) {
  return /<link\b[^>]*\bhreflang=["'][^"']+["'][^>]*>/i.test(html);
}
function attr(attrs, name) {
  const re = new RegExp(`\\b${name}=["']([^"']*)["']`, "i");
  const m = re.exec(attrs);
  return m?.[1];
}

// packages/scanner/src/checks/crawler/http-status.ts
var def7 = {
  id: "crawler.http-status",
  category: ECategory.CRAWLER_ACCESS,
  weight: 3,
  title: "URL returns a healthy 200 status"
};
var DOCS7 = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status";
var SOFT_404_RE = /not found|404|page doesn'?t exist/i;
var httpStatusCheck = defineCheck(def7, (ctx) => {
  const { raw } = ctx;
  const status = raw.status;
  if (raw.error !== undefined || status === 0) {
    return makeResult(def7, EStatus.FAIL, `The URL did not return a response (${raw.error ?? "no status"}).`, {
      evidence: { status, error: raw.error, finalUrl: raw.finalUrl },
      fix: "Make the URL reachable over HTTPS and return a 200; crawlers index nothing if the request fails.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS7
    });
  }
  if (status >= 400) {
    return makeResult(def7, EStatus.FAIL, `The URL returns ${status}. Crawlers cannot index an error page.`, {
      evidence: { status, finalUrl: raw.finalUrl },
      fix: "Return a 200 for content URLs. Fix the underlying 4xx/5xx so AI crawlers receive the page.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS7
    });
  }
  if (status === 200) {
    const title = extractTitle(raw.body) ?? "";
    const bodyText = htmlToText(raw.body).slice(0, 200);
    if (SOFT_404_RE.test(title) || SOFT_404_RE.test(bodyText)) {
      return makeResult(def7, EStatus.WARN, 'The URL returns 200 but the content looks like a "not found" page (soft 404). Crawlers may index an empty/error page.', {
        evidence: { status, title, bodyPreview: bodyText },
        fix: "Return a real 404 status for missing pages; serve a 200 only when there is genuine content.",
        impact: ELevel.MEDIUM,
        effort: ELevel.MEDIUM,
        docsUrl: DOCS7
      });
    }
    return makeResult(def7, EStatus.PASS, "The URL returns 200 OK.", {
      evidence: { status, finalUrl: raw.finalUrl },
      docsUrl: DOCS7
    });
  }
  return makeResult(def7, EStatus.PASS, `The URL returns ${status} (2xx, but not 200).`, {
    evidence: {
      status,
      finalUrl: raw.finalUrl,
      note: "Non-200 2xx may not carry indexable content."
    },
    docsUrl: DOCS7
  });
});

// packages/scanner/src/checks/crawler/noindex.ts
var def8 = {
  id: "crawler.noindex",
  category: ECategory.CRAWLER_ACCESS,
  weight: 4,
  title: "Page is indexable (no noindex)"
};
var DOCS8 = "https://developers.google.com/search/docs/crawling-indexing/block-indexing";
var noindexCheck = defineCheck(def8, (ctx) => {
  const { raw } = ctx;
  const xRobots = (raw.headers["x-robots-tag"] ?? "").toLowerCase();
  const metaRobots = (metaContent(extractMetaTags(raw.body), "robots") ?? "").toLowerCase();
  const noindex = xRobots.includes("noindex") || metaRobots.includes("noindex");
  const nofollow = xRobots.includes("nofollow") || metaRobots.includes("nofollow");
  const evidence = {
    xRobotsTag: raw.headers["x-robots-tag"] ?? null,
    metaRobots: metaRobots || null
  };
  if (noindex) {
    const source = xRobots.includes("noindex") ? "X-Robots-Tag header" : '<meta name="robots">';
    return makeResult(def8, EStatus.FAIL, `The page declares noindex (via ${source}). It is invisible to every indexer, including AI search and answer engines.`, {
      evidence,
      fix: "Remove the noindex directive from the X-Robots-Tag header and the robots meta tag so the page can be indexed.",
      impact: ELevel.HIGH,
      effort: ELevel.LOW,
      docsUrl: DOCS8
    });
  }
  if (nofollow) {
    return makeResult(def8, EStatus.WARN, "The page declares nofollow. It can be indexed, but crawlers will not follow its links to discover related content.", {
      evidence,
      fix: "Remove the nofollow directive unless you intentionally want crawlers to ignore this page's outbound links.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS8
    });
  }
  return makeResult(def8, EStatus.PASS, "No noindex/nofollow directive — the page is indexable.", {
    evidence,
    docsUrl: DOCS8
  });
});

// packages/scanner/src/util/url.ts
function originOf(url) {
  return new URL(url).origin;
}
function hostOf(url) {
  return new URL(url).host;
}
function counterpartHost(host) {
  if (host.startsWith("www.")) {
    return host.slice(4);
  }
  const labels = host.split(".");
  if (labels.length === 2) {
    return `www.${host}`;
  }
  return null;
}

// packages/scanner/src/checks/crawler/www-consistency.ts
var def9 = {
  id: "crawler.www-consistency",
  category: ECategory.CRAWLER_ACCESS,
  weight: 1,
  title: "Single canonical host (www vs apex)",
  scope: ECheckScope.SITE
};
var DOCS9 = "https://developers.google.com/search/docs/crawling-indexing/canonicalization";
var wwwConsistencyCheck = defineCheck(def9, async (ctx) => {
  const canonicalHost = hostOf(ctx.raw.finalUrl);
  const counterpart = counterpartHost(canonicalHost);
  if (counterpart === null) {
    return makeResult(def9, EStatus.PASS, "Host has no www/apex counterpart to reconcile.", {
      evidence: { canonicalHost },
      docsUrl: DOCS9
    });
  }
  const counterpartUrl = `https://${counterpart}/`;
  const res = await ctx.fetchCached(counterpartUrl);
  const finalHost = res.error === undefined ? hostOf(res.finalUrl) : null;
  const redirectedToCanonical = res.redirects.length > 0 && finalHost === canonicalHost;
  if (redirectedToCanonical) {
    return makeResult(def9, EStatus.PASS, `The ${counterpart} variant redirects to ${canonicalHost} (single canonical host).`, {
      evidence: {
        canonicalHost,
        counterpart,
        counterpartStatus: res.status,
        counterpartFinalHost: finalHost
      },
      docsUrl: DOCS9
    });
  }
  if (res.error !== undefined || res.status === 0) {
    return makeResult(def9, EStatus.WARN, `The ${counterpart} host is not reachable (${res.error ?? "no response"}).`, {
      evidence: { canonicalHost, counterpart, counterpartStatus: res.status, error: res.error },
      fix: `Either redirect ${counterpart} to ${canonicalHost}, or make it reachable — an unreachable counterpart can confuse crawlers and break inbound links.`,
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      docsUrl: DOCS9
    });
  }
  if (res.status === 404) {
    return makeResult(def9, EStatus.PASS, `The ${counterpart} host returns 404; ${canonicalHost} is the single host.`, {
      evidence: { canonicalHost, counterpart, counterpartStatus: res.status },
      docsUrl: DOCS9
    });
  }
  if (res.status >= 200 && res.status < 300) {
    return makeResult(def9, EStatus.WARN, `Both ${canonicalHost} and ${counterpart} serve content without redirecting. This host split risks duplicate content and divided crawl signals.`, {
      evidence: {
        canonicalHost,
        counterpart,
        counterpartStatus: res.status,
        counterpartFinalHost: finalHost
      },
      fix: `Pick one canonical host and 301-redirect the other (e.g. ${counterpart} → ${canonicalHost}).`,
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS9
    });
  }
  return makeResult(def9, EStatus.WARN, `The ${counterpart} host returned ${res.status} (not a clean redirect to ${canonicalHost}).`, {
    evidence: {
      canonicalHost,
      counterpart,
      counterpartStatus: res.status,
      counterpartFinalHost: finalHost
    },
    fix: `Ensure ${counterpart} 301-redirects to ${canonicalHost} so there is one canonical host.`,
    impact: ELevel.LOW,
    effort: ELevel.LOW,
    docsUrl: DOCS9
  });
});

// packages/scanner/src/checks/crawler/ua-blocking.ts
var GPTBOT_UA = "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot";
var BLOCKED_STATUSES = new Set([401, 403, 406, 429, 503]);
var def10 = {
  id: "crawler.ua-blocking",
  category: ECategory.CRAWLER_ACCESS,
  weight: 3,
  title: "Server responds equally to AI user-agents",
  scope: ECheckScope.SITE
};
var uaBlocking = defineCheck(def10, async (ctx) => {
  if (!ctx.raw.ok) {
    return makeResult(def10, EStatus.INFO, "primary fetch failed — UA comparison skipped", {
      evidence: { normalStatus: ctx.raw.status }
    });
  }
  const asBot = await ctx.fetchWith(ctx.url, { "user-agent": GPTBOT_UA });
  const evidence = { normalStatus: ctx.raw.status, gptbotUaStatus: asBot.status };
  if (asBot.ok) {
    return makeResult(def10, EStatus.PASS, "AI user-agents receive the same response as browsers", {
      evidence
    });
  }
  if (BLOCKED_STATUSES.has(asBot.status) || asBot.status === 0) {
    return makeResult(def10, EStatus.WARN, `requests presenting a GPTBot user-agent get HTTP ${asBot.status || "no response"} while normal requests get ${ctx.raw.status} — a WAF/server rule is discriminating AI crawlers`, {
      score: 0.25,
      fix: "Review WAF/bot-management rules: if you want AI visibility, allowlist verified AI crawlers (by published IP ranges) instead of blocking by user-agent. Note: if your rule only blocks UNVERIFIED AI user-agents, real crawlers from provider IPs may still pass.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      evidence,
      docsUrl: "https://developers.cloudflare.com/ai-crawl-control/"
    });
  }
  return makeResult(def10, EStatus.WARN, `AI user-agent receives HTTP ${asBot.status} (normal: ${ctx.raw.status}) — responses differ`, {
    score: 0.5,
    fix: "Serve the same content to AI crawlers as to browsers.",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    evidence
  });
});

// packages/scanner/src/checks/crawler/snippet-directives.ts
var def11 = {
  id: "crawler.snippet-directives",
  category: ECategory.CRAWLER_ACCESS,
  weight: 1,
  title: "Snippets are not restricted"
};
var snippetDirectives = defineCheck(def11, (ctx) => {
  const headerValue = ctx.raw.headers["x-robots-tag"] ?? "";
  const metaValue = metaContent(extractMetaTags(ctx.raw.body), "robots") ?? "";
  const combined = `${headerValue},${metaValue}`.toLowerCase();
  if (combined.includes("nosnippet") || /max-snippet\s*:\s*0\b/.test(combined)) {
    return makeResult(def11, EStatus.WARN, "nosnippet / max-snippet:0 is declared — AI answer surfaces cannot quote this page", {
      score: 0,
      fix: "Remove nosnippet (or raise max-snippet) so AI search surfaces can cite your content.",
      impact: ELevel.HIGH,
      effort: ELevel.LOW,
      evidence: { headerValue, metaValue },
      docsUrl: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag"
    });
  }
  const limited = /max-snippet\s*:\s*([1-9]\d{0,1})\b/.exec(combined);
  if (limited !== null && Number(limited[1]) < 50) {
    return makeResult(def11, EStatus.WARN, `max-snippet:${limited[1]} caps quotable text very low for generative answers`, {
      score: 0.5,
      fix: "Raise max-snippet (≥160) or remove the cap.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      evidence: { headerValue, metaValue },
      docsUrl: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag"
    });
  }
  return makeResult(def11, EStatus.PASS, "no snippet restrictions declared", {
    evidence: { headerValue, metaValue }
  });
});

// packages/scanner/src/checks/crawler/index.ts
var crawlerChecks = [
  robotsExistsCheck,
  robotsAiBotsCheck,
  antiBotCheck,
  sitemapCheck,
  redirectsCheck,
  ttfbCheck,
  httpStatusCheck,
  noindexCheck,
  wwwConsistencyCheck,
  uaBlocking,
  snippetDirectives
];

// packages/scanner/src/checks/rendering/empty-shell.ts
var def12 = {
  id: "rendering.empty-shell",
  category: ECategory.RENDERING,
  weight: 4,
  title: "Empty HTML shell"
};
var EMPTY_MOUNT_RE = /<div[^>]*id=["'](root|app|__next|___gatsby)["'][^>]*>\s*<\/div>/i;
var FINGERPRINT_RES = [/data-reactroot/i, /ng-version=/i, /data-v-app/i, /id=["']__nuxt["']/i];
var emptyShell = defineCheck(def12, (ctx) => {
  const html = ctx.raw.body;
  const words = wordCount(htmlToText(html));
  if (words >= 100) {
    return makeResult(def12, EStatus.PASS, "initial HTML carries substantive content", {
      evidence: { words }
    });
  }
  const hasFingerprint = EMPTY_MOUNT_RE.test(html) || FINGERPRINT_RES.some((re) => re.test(html));
  if (words < 30 && hasFingerprint) {
    return makeResult(def12, EStatus.FAIL, "page is an empty SPA shell — no content without JS", {
      fix: "render content server-side (SSR/SSG) so crawlers receive real HTML",
      impact: ELevel.HIGH,
      effort: ELevel.HIGH,
      evidence: { words, hasFingerprint }
    });
  }
  if (words < 30) {
    return makeResult(def12, EStatus.WARN, "near-empty initial HTML", {
      score: 0.5,
      fix: "ensure primary content is present in the server-rendered HTML",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      evidence: { words, hasFingerprint }
    });
  }
  return makeResult(def12, EStatus.WARN, "thin initial HTML", {
    score: 0.5,
    fix: "expand the server-rendered content so crawlers have more to index",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    evidence: { words, hasFingerprint }
  });
});

// packages/scanner/src/checks/rendering/main-content.ts
var def13 = {
  id: "rendering.main-content",
  category: ECategory.RENDERING,
  weight: 2,
  title: "Main content extractability"
};
var mainContent = defineCheck(def13, (ctx) => {
  const html = ctx.raw.body;
  const hasMain = countTag(html, "main") > 0 || countTag(html, "article") > 0;
  const hasSingleH1 = countTag(html, "h1") === 1;
  const hasH2 = countTag(html, "h2") >= 1;
  const hasChrome = countTag(html, "nav") > 0 && countTag(html, "footer") > 0;
  const missing = [];
  if (!hasMain) {
    missing.push("<main> or <article>");
  }
  if (!hasSingleH1) {
    missing.push("exactly one <h1>");
  }
  if (!hasH2) {
    missing.push("at least one <h2>");
  }
  if (!hasChrome) {
    missing.push("<nav> and <footer>");
  }
  const signals = 4 - missing.length;
  const score = signals / 4;
  const evidence = { signals, hasMain, hasSingleH1, hasH2, hasChrome };
  if (signals === 4) {
    return makeResult(def13, EStatus.PASS, "served HTML is semantically extractable", {
      evidence
    });
  }
  const detail = `missing semantic signals: ${missing.join(", ")}`;
  if (signals >= 2) {
    return makeResult(def13, EStatus.WARN, detail, {
      score,
      fix: "add the missing semantic landmarks so crawlers can isolate the main content",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      evidence
    });
  }
  return makeResult(def13, EStatus.FAIL, detail, {
    score,
    fix: "wrap content in <main>/<article> with a single <h1> and section headings",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    evidence
  });
});

// packages/scanner/src/checks/rendering/noscript-fallback.ts
var def14 = {
  id: "rendering.noscript",
  category: ECategory.RENDERING,
  weight: 1,
  title: "Noscript fallback"
};
var noscriptFallback = defineCheck(def14, (ctx) => {
  const html = ctx.raw.body;
  const words = wordCount(htmlToText(html));
  if (words >= 50) {
    return makeResult(def14, EStatus.PASS, "content is present in raw HTML — fallback not needed", {
      evidence: { words }
    });
  }
  if (countTag(html, "script") === 0) {
    return makeResult(def14, EStatus.PASS, "thin page but no JavaScript — nothing hidden behind JS", {
      evidence: { words, scripts: 0 }
    });
  }
  const noscriptWords = tagTextContents(html, "noscript").reduce((sum, text) => sum + wordCount(text), 0);
  if (noscriptWords > 20) {
    return makeResult(def14, EStatus.WARN, "noscript fallback exists but AI crawlers index it poorly", {
      score: 0.5,
      fix: "serve real content in the initial HTML rather than relying on <noscript>",
      impact: ELevel.LOW,
      effort: ELevel.MEDIUM,
      evidence: { words, noscriptWords }
    });
  }
  return makeResult(def14, EStatus.FAIL, "no fallback at all — crawlers see an empty page", {
    score: 0,
    fix: "render content server-side so non-JS crawlers receive real HTML",
    impact: ELevel.MEDIUM,
    effort: ELevel.HIGH,
    evidence: { words, noscriptWords }
  });
});

// packages/scanner/src/checks/rendering/markdown-negotiation.ts
var def15 = {
  id: "rendering.markdown-negotiation",
  category: ECategory.RENDERING,
  weight: 1,
  title: "Markdown content negotiation",
  scope: ECheckScope.SITE
};
var markdownNegotiation = defineCheck(def15, async (ctx) => {
  const response = await ctx.fetchWith(ctx.url, {
    accept: "text/markdown, text/html;q=0.8, */*;q=0.5"
  });
  const contentType = response.headers["content-type"] ?? "";
  const vary = response.headers["vary"] ?? "";
  const looksMarkdown = contentType.includes("text/markdown") || contentType.includes("text/plain") && !response.body.trimStart().startsWith("<");
  if (response.ok && looksMarkdown) {
    return makeResult(def15, EStatus.PASS, "serves Markdown via Accept negotiation (~80% fewer tokens for agents)", {
      evidence: {
        contentType,
        varyAccept: vary.toLowerCase().includes("accept"),
        tokensHeader: response.headers["x-markdown-tokens"]
      },
      docsUrl: "https://blog.cloudflare.com/markdown-for-agents/"
    });
  }
  return makeResult(def15, EStatus.INFO, "no Markdown negotiation — emerging standard (Cloudflare, Vercel, Mintlify serve it); no score impact", {
    evidence: { contentType },
    docsUrl: "https://blog.cloudflare.com/markdown-for-agents/"
  });
});

// packages/scanner/src/checks/rendering/image-alt.ts
var def16 = {
  id: "rendering.image-alt",
  category: ECategory.RENDERING,
  weight: 1,
  title: "Images carry alt text"
};
var imageAlt = defineCheck(def16, (ctx) => {
  const html = ctx.raw.body;
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  if (imgs.length === 0) {
    return makeResult(def16, EStatus.INFO, "no <img> elements found — nothing to check", {
      evidence: { images: 0 }
    });
  }
  const withAlt = imgs.filter((tag) => /\balt=["'][^"']+["']/i.test(tag)).length;
  const coverage = withAlt / imgs.length;
  const evidence = { images: imgs.length, withAlt, coverage: Math.round(coverage * 100) / 100 };
  if (coverage >= 0.8) {
    return makeResult(def16, EStatus.PASS, `${withAlt}/${imgs.length} images have alt text`, {
      evidence
    });
  }
  return makeResult(def16, coverage >= 0.5 ? EStatus.WARN : EStatus.FAIL, `only ${withAlt}/${imgs.length} images have alt text — invisible to multimodal extraction`, {
    score: coverage,
    fix: 'Add descriptive alt attributes to every meaningful image (empty alt="" for decorative ones).',
    impact: ELevel.MEDIUM,
    effort: ELevel.LOW,
    evidence
  });
});

// packages/scanner/src/checks/rendering/index.ts
var renderingChecks = [
  emptyShell,
  mainContent,
  noscriptFallback,
  markdownNegotiation,
  imageAlt
];

// packages/scanner/src/checks/structured-data/json-ld.ts
var def17 = {
  id: "structured.json-ld",
  category: ECategory.STRUCTURED_DATA,
  weight: 5,
  title: "JSON-LD structured data"
};
var IDENTITY_TYPES = new Set(["Organization", "WebSite", "Person"]);
var CONTENT_TYPES = new Set([
  "Article",
  "BlogPosting",
  "NewsArticle",
  "Product",
  "SoftwareApplication",
  "FAQPage",
  "HowTo",
  "BreadcrumbList"
]);
var jsonLdCheck = defineCheck(def17, (ctx) => {
  const blocks = extractJsonLd(ctx.raw.body);
  if (blocks.length === 0) {
    return makeResult(def17, EStatus.FAIL, "no JSON-LD found in the served HTML", {
      fix: "add schema.org JSON-LD to the HTML the server returns. Schema injected client-side by JS is invisible to non-JS AI crawlers.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      evidence: { blocks: 0, types: [] }
    });
  }
  const types = jsonLdTypes(blocks);
  const hasIdentity = types.some((t) => IDENTITY_TYPES.has(t));
  const hasContent = types.some((t) => CONTENT_TYPES.has(t));
  const score = 0.5 + (hasIdentity ? 0.25 : 0) + (hasContent ? 0.25 : 0);
  const evidence = { blocks: blocks.length, types, hasIdentity, hasContent };
  if (score >= 0.75) {
    return makeResult(def17, EStatus.PASS, "JSON-LD describes identity and/or content", {
      score,
      evidence
    });
  }
  const missing = !hasIdentity && !hasContent ? "no identity (Organization/WebSite/Person) or content (Article/Product/FAQ…) types" : !hasIdentity ? "no identity type (Organization/WebSite/Person)" : "no content type (Article/Product/FAQPage/HowTo…)";
  return makeResult(def17, EStatus.WARN, `JSON-LD present but ${missing}`, {
    score,
    fix: "add identity (Organization/WebSite/Person) and content (Article/Product/FAQPage…) schema so AI crawlers can model the page.",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    evidence
  });
});

// packages/scanner/src/checks/structured-data/meta-basics.ts
var def18 = {
  id: "structured.meta-basics",
  category: ECategory.STRUCTURED_DATA,
  weight: 4,
  title: "Title, description & canonical"
};
var TITLE_MIN = 10;
var TITLE_MAX = 70;
var DESC_MIN = 50;
var DESC_MAX = 160;
var metaBasicsCheck = defineCheck(def18, (ctx) => {
  const html = ctx.raw.body;
  const tags = extractMetaTags(html);
  const title = extractTitle(html);
  const titleLen = title?.length ?? 0;
  const description = metaContent(tags, "description") ?? null;
  const descLen = description?.length ?? 0;
  const canonical = extractCanonical(html);
  const issues = [];
  if (title === null || titleLen === 0) {
    issues.push("title is missing");
  } else if (titleLen < TITLE_MIN) {
    issues.push(`title is too short (${titleLen} chars, want ${TITLE_MIN}–${TITLE_MAX})`);
  } else if (titleLen > TITLE_MAX) {
    issues.push(`title is too long (${titleLen} chars, want ${TITLE_MIN}–${TITLE_MAX})`);
  }
  if (description === null || descLen === 0) {
    issues.push("meta description is missing");
  } else if (descLen < DESC_MIN) {
    issues.push(`meta description is too short (${descLen} chars, want ${DESC_MIN}–${DESC_MAX})`);
  } else if (descLen > DESC_MAX) {
    issues.push(`meta description is too long (${descLen} chars, want ${DESC_MIN}–${DESC_MAX})`);
  }
  const canonicalIssue = checkCanonical(canonical, ctx.raw.finalUrl);
  if (canonicalIssue !== null) {
    issues.push(canonicalIssue);
  }
  const score = Math.max(0, (3 - issues.length) / 3);
  const evidence = { titleLength: titleLen, descriptionLength: descLen, canonical };
  if (issues.length === 0) {
    return makeResult(def18, EStatus.PASS, "title, description and canonical are all healthy", {
      score,
      evidence
    });
  }
  const status = issues.length >= 2 ? EStatus.FAIL : EStatus.WARN;
  return makeResult(def18, status, issues.join("; "), {
    score,
    fix: 'set a 10–70 char <title>, a 50–160 char meta description, and an absolute same-host <link rel="canonical">.',
    impact: issues.length >= 2 ? ELevel.HIGH : ELevel.MEDIUM,
    effort: ELevel.LOW,
    evidence
  });
});
function checkCanonical(canonical, finalUrl) {
  if (canonical === null || canonical.length === 0) {
    return "canonical link is missing";
  }
  let parsed;
  try {
    parsed = new URL(canonical);
  } catch {
    return `canonical is not an absolute URL (${canonical})`;
  }
  const finalHost = new URL(finalUrl).host;
  if (parsed.host !== finalHost) {
    return `canonical points to a different host (${parsed.host} ≠ ${finalHost})`;
  }
  return null;
}

// packages/scanner/src/checks/structured-data/open-graph.ts
var def19 = {
  id: "structured.open-graph",
  category: ECategory.STRUCTURED_DATA,
  weight: 2,
  title: "Open Graph metadata"
};
var SIGNALS = ["og:title", "og:description", "og:image", "og:url", "twitter:card"];
var openGraphCheck = defineCheck(def19, (ctx) => {
  const tags = extractMetaTags(ctx.raw.body);
  const present = SIGNALS.filter((key) => {
    const value = metaContent(tags, key);
    return value !== undefined && value.trim().length > 0;
  });
  const missing = SIGNALS.filter((key) => !present.includes(key));
  const score = present.length / SIGNALS.length;
  const evidence = { present, missing };
  if (present.length >= 4) {
    return makeResult(def19, EStatus.PASS, "core Open Graph signals are present", {
      score,
      evidence
    });
  }
  const status = present.length >= 2 ? EStatus.WARN : EStatus.FAIL;
  return makeResult(def19, status, `missing Open Graph signals: ${missing.join(", ")}`, {
    score,
    fix: "add og:title, og:description, og:image, og:url and twitter:card so share surfaces and AI summaries render correctly.",
    impact: present.length >= 2 ? "low" : "medium",
    effort: ELevel.LOW,
    evidence
  });
});

// packages/scanner/src/checks/structured-data/author-eeat.ts
var def20 = {
  id: "structured.author-eeat",
  category: ECategory.STRUCTURED_DATA,
  weight: 2,
  title: "Author & E-E-A-T signals"
};
var ARTICLE_TYPES = new Set(["Article", "BlogPosting", "NewsArticle"]);
var authorEeatCheck = defineCheck(def20, (ctx) => {
  const blocks = extractJsonLd(ctx.raw.body);
  const nodes = flatten(blocks);
  const metaAuthor = hasMetaAuthor(ctx.raw.body);
  const articleNodes = nodes.filter((n) => nodeHasType(n, ARTICLE_TYPES));
  if (articleNodes.length > 0) {
    const hasAuthor = articleNodes.some(hasAuthorName) || metaAuthor;
    const hasDate = articleNodes.some((n) => hasNonEmpty(n, "datePublished"));
    const evidence2 = { mode: "article", hasAuthor, hasDate, metaAuthor };
    if (hasAuthor && hasDate) {
      return makeResult(def20, EStatus.PASS, "article declares author and publish date", {
        evidence: evidence2
      });
    }
    if (hasAuthor || hasDate) {
      return makeResult(def20, EStatus.WARN, hasAuthor ? "article is missing datePublished" : "article is missing an author", {
        score: 0.5,
        fix: "add both author (with name) and datePublished to the article JSON-LD for E-E-A-T attribution.",
        impact: ELevel.MEDIUM,
        effort: ELevel.LOW,
        evidence: evidence2
      });
    }
    return makeResult(def20, EStatus.FAIL, "article has no author or publish date", {
      fix: "add author (with name) and datePublished to the article JSON-LD so AI crawlers can attribute the content.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      evidence: evidence2
    });
  }
  const orgWithIdentity = nodes.some((n) => nodeHasType(n, new Set(["Organization"])) && (hasNonEmpty(n, "logo") || hasNonEmpty(n, "sameAs")));
  const evidence = { mode: "entity", orgWithIdentity, metaAuthor };
  if (orgWithIdentity) {
    return makeResult(def20, EStatus.PASS, "Organization declares logo / sameAs identity", {
      evidence
    });
  }
  return makeResult(def20, EStatus.WARN, "no entity-identity signals (E-E-A-T)", {
    score: 0.5,
    fix: "add an Organization with logo and sameAs links (or author markup) to establish E-E-A-T.",
    impact: ELevel.LOW,
    effort: ELevel.LOW,
    evidence
  });
});
function flatten(blocks) {
  const out = [];
  const visit = (node) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node && typeof node === "object") {
      const obj = node;
      out.push(obj);
      if (Array.isArray(obj["@graph"])) {
        obj["@graph"].forEach(visit);
      }
    }
  };
  blocks.forEach(visit);
  return out;
}
function nodeHasType(node, types) {
  const t = node["@type"];
  if (typeof t === "string") {
    return types.has(t);
  }
  if (Array.isArray(t)) {
    return t.some((x) => typeof x === "string" && types.has(x));
  }
  return false;
}
function hasNonEmpty(node, key) {
  const value = node[key];
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
}
function hasAuthorName(node) {
  return authorHasName(node["author"]);
}
function authorHasName(author) {
  if (typeof author === "string") {
    return author.trim().length > 0;
  }
  if (Array.isArray(author)) {
    return author.some(authorHasName);
  }
  if (author && typeof author === "object") {
    const name = author["name"];
    return typeof name === "string" && name.trim().length > 0;
  }
  return false;
}
function hasMetaAuthor(html) {
  const value = metaContent(extractMetaTags(html), "author");
  return value !== undefined && value.trim().length > 0;
}

// packages/scanner/src/checks/structured-data/lang-hreflang.ts
var def21 = {
  id: "structured.lang",
  category: ECategory.STRUCTURED_DATA,
  weight: 1,
  title: "Language declaration"
};
var langHreflangCheck = defineCheck(def21, (ctx) => {
  const lang = extractHtmlLangAttr(ctx.raw.body);
  const hreflang = hasHreflang(ctx.raw.body);
  const evidence = { lang, hreflang };
  if (lang !== null && lang.length > 0) {
    const detail2 = hreflang ? `content language declared (lang="${lang}"); hreflang alternates present` : `content language declared (lang="${lang}")`;
    return makeResult(def21, EStatus.PASS, detail2, { evidence });
  }
  const detail = hreflang ? "<html lang> attribute is missing; hreflang alternates present" : "<html lang> attribute is missing";
  return makeResult(def21, EStatus.WARN, detail, {
    score: 0.25,
    fix: 'add a <html lang="…"> attribute so crawlers and LLMs know the content language.',
    impact: ELevel.LOW,
    effort: ELevel.LOW,
    evidence
  });
});

// packages/scanner/src/checks/structured-data/index.ts
var structuredDataChecks = [
  jsonLdCheck,
  metaBasicsCheck,
  openGraphCheck,
  authorEeatCheck,
  langHreflangCheck
];

// packages/scanner/src/checks/trust/https.ts
var def22 = {
  id: "trust.https",
  category: ECategory.TRUST,
  weight: 3,
  title: "Site is served over a valid HTTPS connection",
  scope: ECheckScope.SITE
};
var DOCS10 = "https://developers.google.com/search/docs/crawling-indexing/https";
var httpsCheck = defineCheck(def22, (ctx) => {
  const { finalUrl, tls } = ctx.raw;
  if (tls?.valid === false) {
    return makeResult(def22, EStatus.FAIL, "TLS certificate is invalid; crawlers reject the connection.", {
      evidence: { finalUrl, tlsError: tls.error },
      fix: "Install a valid certificate (correct chain, hostname, and not expired). AI crawlers abort on TLS errors.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS10
    });
  }
  if (!finalUrl.startsWith("https://")) {
    return makeResult(def22, EStatus.FAIL, "Final URL is served over plain HTTP, not HTTPS.", {
      evidence: { finalUrl },
      fix: "Serve the site over HTTPS and redirect HTTP to HTTPS. AI crawlers and search engines down-rank or skip insecure pages.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS10
    });
  }
  return makeResult(def22, EStatus.PASS, "Site is served over a valid HTTPS connection.", {
    evidence: { finalUrl, tlsValid: tls?.valid ?? true },
    docsUrl: DOCS10
  });
});

// packages/scanner/src/checks/trust/hsts.ts
var def23 = {
  id: "trust.hsts",
  category: ECategory.TRUST,
  weight: 1,
  title: "Strict-Transport-Security header is present",
  scope: ECheckScope.SITE
};
var DOCS11 = "https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security";
var MIN_MAX_AGE = 31536000;
var hstsCheck = defineCheck(def23, (ctx) => {
  const value = ctx.raw.headers["strict-transport-security"];
  if (value === undefined) {
    return makeResult(def23, EStatus.WARN, "No Strict-Transport-Security header.", {
      evidence: { present: false },
      fix: "Add a Strict-Transport-Security header (e.g. max-age=31536000; includeSubDomains) to enforce HTTPS on every request.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      docsUrl: DOCS11
    });
  }
  const maxAgeMatch = /max-age\s*=\s*(\d+)/i.exec(value);
  const maxAge = maxAgeMatch ? Number(maxAgeMatch[1]) : undefined;
  const weak = maxAge !== undefined && maxAge < MIN_MAX_AGE;
  const detail = weak ? `HSTS present but max-age (${maxAge}s) is below the recommended ${MIN_MAX_AGE}s.` : "Strict-Transport-Security header is present.";
  return makeResult(def23, EStatus.PASS, detail, {
    evidence: { value, maxAge },
    docsUrl: DOCS11
  });
});

// packages/scanner/src/checks/trust/mixed-content.ts
var def24 = {
  id: "trust.mixed-content",
  category: ECategory.TRUST,
  weight: 1,
  title: "No insecure (http://) sub-resources on an HTTPS page"
};
var DOCS12 = "https://developer.mozilla.org/docs/Web/Security/Mixed_content";
var MIXED_RE = /<(?:script|img|link|iframe)\b[^>]*?\b(?:src|href)\s*=\s*["'](http:\/\/[^"']+)["']/gi;
var mixedContentCheck = defineCheck(def24, (ctx) => {
  const { finalUrl, body } = ctx.raw;
  if (!finalUrl.startsWith("https://")) {
    return makeResult(def24, EStatus.INFO, "Page is HTTP; mixed-content check is not applicable.", {
      evidence: { finalUrl },
      docsUrl: DOCS12
    });
  }
  const hits = [];
  let m;
  while ((m = MIXED_RE.exec(body)) !== null) {
    if (m[1] !== undefined) {
      hits.push(m[1]);
    }
  }
  if (hits.length > 0) {
    return makeResult(def24, EStatus.WARN, `Found ${hits.length} insecure http:// sub-resource(s) on an HTTPS page.`, {
      evidence: { count: hits.length, examples: hits.slice(0, 3) },
      fix: "Load every sub-resource (scripts, images, stylesheets, iframes) over https://. Browsers block mixed content and it signals a neglected site.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS12
    });
  }
  return makeResult(def24, EStatus.PASS, "No insecure http:// sub-resources detected.", {
    evidence: { count: 0 },
    docsUrl: DOCS12
  });
});

// packages/scanner/src/checks/trust/index.ts
var trustChecks = [httpsCheck, hstsCheck, mixedContentCheck];

// packages/scanner/src/checks/geo/content-depth.ts
var def25 = {
  id: "geo.content-depth",
  category: ECategory.GEO_CONTENT,
  weight: 3,
  title: "Page has enough content to be cited by AI answer engines"
};
var DOCS13 = "https://arxiv.org/abs/2311.09735";
var contentDepthCheck = defineCheck(def25, (ctx) => {
  const html = ctx.raw.body;
  const words = wordCount(htmlToText(html));
  if (words >= 800) {
    return makeResult(def25, EStatus.PASS, `Page has ${words} words — substantial enough for AI citation.`, {
      evidence: { wordCount: words },
      docsUrl: DOCS13
    });
  }
  if (words >= 300) {
    return makeResult(def25, EStatus.WARN, `Page has ${words} words — thin for AI citation; sub-800-word pages are cited far less.`, {
      evidence: { wordCount: words },
      fix: "Expand the page past ~800 words of substantive, on-topic content. Generative engines disproportionately cite deeper pages.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      score: 0.6,
      docsUrl: DOCS13
    });
  }
  return makeResult(def25, EStatus.FAIL, `Page has only ${words} words — too thin to be cited by AI answer engines.`, {
    evidence: { wordCount: words },
    fix: "Add real, substantive content (aim for 800+ words). Pages under 300 words are rarely surfaced or cited by generative search.",
    impact: ELevel.HIGH,
    effort: ELevel.MEDIUM,
    docsUrl: DOCS13
  });
});

// packages/scanner/src/checks/geo/headings-structure.ts
var def26 = {
  id: "geo.headings",
  category: ECategory.GEO_CONTENT,
  weight: 2,
  title: "Page uses a clear heading hierarchy"
};
var DOCS14 = "https://arxiv.org/abs/2311.09735";
var WORDS_PER_HEADING = 250;
var headingsStructureCheck = defineCheck(def26, (ctx) => {
  const html = ctx.raw.body;
  const words = wordCount(htmlToText(html));
  const h1 = countTag(html, "h1");
  const h2 = countTag(html, "h2");
  const h3 = countTag(html, "h3");
  const headings = h1 + h2 + h3;
  const hasSingleH1 = h1 === 1;
  const hasEnoughH2 = h2 >= 2;
  const denseEnough = words > 0 && headings >= words / WORDS_PER_HEADING;
  const signals = [hasSingleH1, hasEnoughH2, denseEnough].filter(Boolean).length;
  const score = signals / 3;
  const evidence = { h1, h2, h3, wordCount: words, hasSingleH1, hasEnoughH2, denseEnough };
  if (signals === 3) {
    return makeResult(def26, EStatus.PASS, "Page has a clear heading hierarchy.", {
      evidence,
      docsUrl: DOCS14
    });
  }
  if (signals === 2) {
    return makeResult(def26, EStatus.WARN, "Heading hierarchy is partly weak; AI engines chunk content by headings.", {
      evidence,
      fix: "Use exactly one <h1>, at least two <h2> sections, and roughly one heading per 250 words to make content easy to chunk and cite.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      score,
      docsUrl: DOCS14
    });
  }
  return makeResult(def26, EStatus.FAIL, "Page lacks a usable heading hierarchy for AI chunking.", {
    evidence,
    fix: "Add a single <h1>, multiple <h2> section headings, and enough sub-headings so generative engines can segment and cite the page.",
    impact: ELevel.MEDIUM,
    effort: ELevel.LOW,
    score,
    docsUrl: DOCS14
  });
});

// packages/scanner/src/checks/geo/statistics-citations.ts
var def27 = {
  id: "geo.statistics",
  category: ECategory.GEO_CONTENT,
  weight: 2,
  title: "Content includes statistics, quotations, and external citations"
};
var DOCS15 = "https://arxiv.org/abs/2311.09735";
var STAT_RE = /\b\d+([.,]\d+)?\s*(%|percent|million|billion|k\b)/gi;
var YEAR_RE = /\b(19|20)\d{2}\b/g;
var QUOTED_SPAN_RE = /[“"]([^“”"]{41,})[”"]/g;
var ANCHOR_RE = /<a\b[^>]*?\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/gi;
var statisticsCitationsCheck = defineCheck(def27, (ctx) => {
  const html = ctx.raw.body;
  const text = htmlToText(html);
  const pageHost = safeHost(ctx.raw.finalUrl);
  const stats = (text.match(STAT_RE)?.length ?? 0) + (text.match(YEAR_RE)?.length ?? 0);
  const quotations = countTag(html, "blockquote") + countTag(html, "q") + (text.match(QUOTED_SPAN_RE)?.length ?? 0);
  let externalCitations = 0;
  let m;
  while ((m = ANCHOR_RE.exec(html)) !== null) {
    const linkHost = safeHost(m[1] ?? "");
    if (linkHost !== null && linkHost !== pageHost) {
      externalCitations++;
    }
  }
  const hasStats = stats > 0;
  const hasQuotes = quotations > 0;
  const hasCitations = externalCitations > 0;
  const families = [hasStats, hasQuotes, hasCitations].filter(Boolean).length;
  const score = families / 3;
  const evidence = { statistics: stats, quotations, externalCitations, families };
  const detail = "Quotations lift visibility ~+41% and statistics ~+32% in generative answers (Aggarwal et al., KDD 2024).";
  if (families >= 2) {
    return makeResult(def27, EStatus.PASS, `Content has ${families}/3 citation signals. ${detail}`, {
      evidence,
      docsUrl: DOCS15
    });
  }
  if (families === 1) {
    return makeResult(def27, EStatus.WARN, `Content has only 1/3 citation signals. ${detail}`, {
      evidence,
      fix: "Add concrete statistics, direct quotations, and links to authoritative external sources; these are the strongest GEO levers.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      score,
      docsUrl: DOCS15
    });
  }
  return makeResult(def27, EStatus.WARN, `Content has no statistics, quotations, or external citations. ${detail}`, {
    evidence,
    fix: "Add concrete statistics, direct quotations, and links to authoritative external sources; these are the strongest GEO levers.",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    score: 0.25,
    docsUrl: DOCS15
  });
});
function safeHost(url) {
  try {
    return hostOf(url);
  } catch {
    return null;
  }
}

// packages/scanner/src/checks/geo/content-noise.ts
var def28 = {
  id: "geo.content-noise",
  category: ECategory.GEO_CONTENT,
  weight: 2,
  title: "Main content outweighs navigation/chrome"
};
var DOCS16 = "https://arxiv.org/abs/2311.09735";
var contentNoiseCheck = defineCheck(def28, (ctx) => {
  const html = ctx.raw.body;
  const totalWords = wordCount(htmlToText(html));
  const mains = tagTextContents(html, "main");
  const articles = tagTextContents(html, "article");
  const region = mains[0] ?? articles[0];
  if (region === undefined) {
    return makeResult(def28, EStatus.INFO, "No <main> or <article> — cannot measure content-to-noise ratio. Add semantic <main>.", {
      evidence: { hasMain: false, hasArticle: false, totalWords },
      fix: "Wrap the primary content in a semantic <main> or <article> so crawlers (and this check) can separate content from chrome.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      score: 0.5,
      docsUrl: DOCS16
    });
  }
  const mainWords = wordCount(region);
  const ratio = totalWords > 0 ? mainWords / totalWords : 0;
  const evidence = { mainWords, totalWords, ratio: Number(ratio.toFixed(2)) };
  if (ratio >= 0.5) {
    return makeResult(def28, EStatus.PASS, "Main content clearly outweighs navigation and chrome.", {
      evidence,
      docsUrl: DOCS16
    });
  }
  if (ratio >= 0.25) {
    return makeResult(def28, EStatus.WARN, "Roughly half the page is chrome; main content is diluted.", {
      evidence,
      fix: "Trim boilerplate (nav, sidebars, footers) or expand the <main> content so the primary content dominates the page.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS16
    });
  }
  return makeResult(def28, EStatus.FAIL, "Content drowned in chrome; main content is a small fraction of the page.", {
    evidence,
    fix: "Restructure so the <main>/<article> content dominates. Crawlers may treat a chrome-heavy page as low-value.",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    docsUrl: DOCS16
  });
});

// packages/scanner/src/checks/geo/freshness.ts
var STALE_MONTHS = 18;
var def29 = {
  id: "geo.freshness",
  category: ECategory.GEO_CONTENT,
  weight: 1,
  title: "Machine-readable freshness signals"
};
var freshness = defineCheck(def29, (ctx) => {
  const dates = [];
  const visit = (node) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node !== null && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        if ((key === "dateModified" || key === "datePublished") && typeof value === "string") {
          dates.push(value);
        } else if (typeof value === "object") {
          visit(value);
        }
      }
    }
  };
  extractJsonLd(ctx.raw.body).forEach(visit);
  const lastModified = ctx.raw.headers["last-modified"];
  if (lastModified !== undefined) {
    dates.push(lastModified);
  }
  const parsed = dates.map((d) => new Date(d).getTime()).filter((t) => !Number.isNaN(t));
  if (parsed.length === 0) {
    return makeResult(def29, EStatus.WARN, "no machine-readable dates (JSON-LD datePublished/dateModified or Last-Modified header)", {
      score: 0.5,
      fix: "Add datePublished and dateModified to your JSON-LD (or send a Last-Modified header) so engines can judge freshness.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      evidence: { sources: 0 }
    });
  }
  const newest = Math.max(...parsed);
  const ageMonths = (Date.now() - newest) / (1000 * 60 * 60 * 24 * 30);
  const evidence = { newest: new Date(newest).toISOString().slice(0, 10), sources: parsed.length };
  if (ageMonths <= STALE_MONTHS) {
    return makeResult(def29, EStatus.PASS, `freshness signals present (newest: ${evidence.newest})`, {
      evidence
    });
  }
  return makeResult(def29, EStatus.WARN, `newest declared date is ${evidence.newest} — stale content is cited less by generative engines`, {
    score: 0.5,
    fix: "Refresh the content and update dateModified — recently-updated pages earn measurably more AI citations.",
    impact: ELevel.LOW,
    effort: ELevel.MEDIUM,
    evidence
  });
});

// packages/scanner/src/checks/geo/extractability.ts
var def30 = {
  id: "geo.extractability",
  category: ECategory.GEO_CONTENT,
  weight: 2,
  title: "Content is structured for AI extraction"
};
var DOCS17 = "https://arxiv.org/abs/2311.09735";
var QUESTION_HEADING_RE = /<h[2-4][^>]*>[^<]*\?[^<]*<\/h[2-4]>/gi;
var MIN_WORDS = 120;
var extractabilityCheck = defineCheck(def30, (ctx) => {
  const html = ctx.raw.body;
  const words = wordCount(htmlToText(html));
  if (words < MIN_WORDS) {
    return makeResult(def30, EStatus.INFO, "too little text to judge extractable structure — see content depth instead", { evidence: { wordCount: words } });
  }
  const tables = countTag(html, "table");
  const lists = countTag(html, "ul") + countTag(html, "ol");
  const definitionLists = countTag(html, "dl");
  const questionHeadings = html.match(QUESTION_HEADING_RE)?.length ?? 0;
  const hasTables = tables > 0 || definitionLists > 0;
  const hasLists = lists > 0;
  const hasQa = questionHeadings > 0;
  const formats = [hasTables, hasLists, hasQa].filter(Boolean).length;
  const score = formats / 3;
  const evidence = { tables, lists, definitionLists, questionHeadings, wordCount: words };
  if (formats >= 2) {
    return makeResult(def30, EStatus.PASS, `Content offers ${formats}/3 extractable formats (tables, lists, Q&A headings) — easy for generative engines to quote.`, { evidence, score, docsUrl: DOCS17 });
  }
  if (formats === 1) {
    return makeResult(def30, EStatus.WARN, "Content offers only 1/3 extractable formats — AI engines favor tables, lists and Q&A-shaped sections when composing answers.", {
      evidence,
      fix: "Structure key facts as data tables or lists and add question-shaped headings with self-contained answers (Q&A / FAQ sections).",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      score,
      docsUrl: DOCS17
    });
  }
  return makeResult(def30, EStatus.WARN, "Content is wall-of-text: no tables, lists or Q&A-shaped sections for generative engines to lift.", {
    evidence,
    fix: "Break prose into lists and tables and add Q&A-style headings — extractable passages are what AI answers actually quote.",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    score: 0.25,
    docsUrl: DOCS17
  });
});

// packages/scanner/src/checks/geo/index.ts
var geoChecks = [
  contentDepthCheck,
  headingsStructureCheck,
  statisticsCitationsCheck,
  contentNoiseCheck,
  freshness,
  extractabilityCheck
];

// packages/scanner/src/checks/llms-txt.ts
var def31 = {
  id: "llms-txt.present",
  category: ECategory.CRAWLER_ACCESS,
  weight: 0,
  title: "llms.txt presence (informational)",
  scope: ECheckScope.SITE
};
var DOCS18 = "https://llmstxt.org";
var llmsTxtCheck = defineCheck(def31, async (ctx) => {
  const llmsUrl = `${originOf(ctx.raw.finalUrl)}/llms.txt`;
  const res = await ctx.fetchCached(llmsUrl);
  const body = res.body.trim();
  const present = res.error === undefined && res.status === 200 && body.length > 0 && !body.startsWith("<");
  if (present) {
    return makeResult(def31, EStatus.INFO, "llms.txt present — optional signal consumed by some dev tools (Cursor, IDE agents), ignored by major AI crawlers.", {
      evidence: { url: llmsUrl, status: res.status, present: true },
      score: 1,
      docsUrl: DOCS18
    });
  }
  return makeResult(def31, EStatus.INFO, "no llms.txt — optional; not consumed by major AI providers, low priority.", {
    evidence: { url: llmsUrl, status: res.status, present: false },
    score: 1,
    docsUrl: DOCS18
  });
});

// packages/scanner/src/checks/content-signals.ts
var def32 = {
  id: "content-signals.present",
  category: ECategory.CRAWLER_ACCESS,
  weight: 0,
  title: "Content Signals policy",
  scope: ECheckScope.SITE
};
var contentSignalsCheck = defineCheck(def32, async (ctx) => {
  const robots = await ctx.fetchCached(`${originOf(ctx.url)}/robots.txt`);
  if (!robots.ok) {
    return makeResult(def32, EStatus.INFO, "no robots.txt — no Content Signals to read", {
      evidence: { robotsStatus: robots.status }
    });
  }
  const lines = robots.body.split(/\r?\n/).filter((line) => /^\s*content-signal\s*:/i.test(line)).map((line) => line.trim());
  const detail = lines.length > 0 ? `declares Content Signals (${lines.join(" · ")}) — advisory AI-usage policy (no score impact)` : "no Content Signals in robots.txt — emerging advisory standard (~4% adoption); no score impact";
  return makeResult(def32, EStatus.INFO, detail, {
    evidence: { signals: lines },
    docsUrl: "https://blog.cloudflare.com/content-signals-policy/"
  });
});

// packages/scanner/src/checks/index.ts
var allChecks = [
  ...crawlerChecks,
  ...renderingChecks,
  ...structuredDataChecks,
  ...trustChecks,
  ...geoChecks,
  llmsTxtCheck,
  contentSignalsCheck
];
// packages/scanner/src/smart-agent/template-sample.ts
function templateKey(rawUrl) {
  let pathname;
  try {
    pathname = new URL(rawUrl).pathname;
  } catch {
    pathname = rawUrl;
  }
  const segments = pathname.split("/").filter((segment) => segment.length > 0);
  return `/${segments.map(normalizeSegment).join("/")}`;
}
function normalizeSegment(segment) {
  const value = segment.toLowerCase();
  if (/^\d+$/.test(value)) {
    return ":n";
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value)) {
    return ":uuid";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return ":date";
  }
  if (/^[0-9a-f]{16,}$/.test(value)) {
    return ":hash";
  }
  if (/\d/.test(value) && value.includes("-") || value.length > 24) {
    return ":slug";
  }
  return value;
}

// packages/scanner/src/markdown.ts
function reportToMarkdown(report, mode = "human") {
  if ("primary" in report) {
    const site = report;
    const base = mode === "llm" ? llmMarkdown(site.primary) : humanMarkdown(site.primary);
    return spliceClusters(base, siteClustersBlock(site, mode));
  }
  return mode === "llm" ? llmMarkdown(report) : humanMarkdown(report);
}
function siteClustersBlock(site, mode) {
  const clusters = site.clusters ?? [];
  const totalFound = clusters.reduce((sum, c) => sum + c.pageCount, 0);
  const totalScanned = clusters.reduce((sum, c) => sum + c.scannedCount, 0);
  const heading = mode === "llm" ? "## Site scope (deep crawl)" : "## Structural templates";
  const lines = [
    heading,
    "",
    `${clusters.length} template${clusters.length !== 1 ? "s" : ""} · ${totalFound} pages found · ${totalScanned} scanned`,
    "",
    "| Template | Avg score | Found | Scanned |",
    "|---|---:|---:|---:|",
    ...clusters.map((cluster) => {
      const pattern = templateKey(cluster.representativeUrl).replace(/:[a-z]+/g, "*");
      return `| \`${pattern}\` | ${cluster.avgScore} | ${cluster.pageCount} | ${cluster.scannedCount} |`;
    }),
    ""
  ];
  return lines.join(`
`);
}
function spliceClusters(base, block) {
  const sep = `
---
`;
  const idx = base.lastIndexOf(sep);
  if (idx === -1)
    return `${base}
${block}`;
  return `${base.slice(0, idx)}

${block}${base.slice(idx)}`;
}
function humanMarkdown(report) {
  const lines = [];
  const failing = report.checks.filter((c) => c.status === "fail");
  const warning = report.checks.filter((c) => c.status === "warn");
  const passed = report.checks.filter((c) => c.status === "pass");
  lines.push(`# AI readiness report — ${hostOf(report.finalUrl)}`);
  lines.push("");
  lines.push(`> **${report.overall}/100 · ${report.grade.toUpperCase()}** — scanned ${report.finishedAt.slice(0, 10)} · score v${report.scoreVersion} · [isready.ai](https://isready.ai)`);
  lines.push("");
  lines.push(`Scanned URL: ${report.finalUrl}`);
  lines.push("");
  lines.push("## Scores");
  lines.push("");
  lines.push("| Category | Score | Weight |");
  lines.push("|---|---:|---:|");
  for (const category of report.categories) {
    lines.push(`| ${category.label} | ${category.score} | ${Math.round(category.weight * 100)}% |`);
  }
  lines.push("");
  if (failing.length > 0) {
    lines.push("## ✗ Failed checks");
    lines.push("");
    for (const check of failing) {
      lines.push(...findingBlock(check));
    }
  }
  if (warning.length > 0) {
    lines.push("## ▲ Warnings");
    lines.push("");
    for (const check of warning) {
      lines.push(...findingBlock(check));
    }
  }
  lines.push("## ✓ Passed");
  lines.push("");
  lines.push(passed.map((c) => `\`${c.id}\``).join(" · "));
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("Re-scan any time: `npx isreadyai " + hostOf(report.finalUrl) + "` or https://isready.ai");
  lines.push("");
  return lines.join(`
`);
}
function findingBlock(check) {
  const lines = [];
  lines.push(`### ${check.title} (\`${check.id}\`)`);
  lines.push("");
  lines.push(check.detail);
  lines.push("");
  if (check.fix !== undefined) {
    lines.push(`**Fix:** ${check.fix}`);
    lines.push("");
  }
  const meta = [];
  if (check.impact !== undefined) {
    meta.push(`impact: ${check.impact}`);
  }
  if (check.effort !== undefined) {
    meta.push(`effort: ${check.effort}`);
  }
  if (check.docsUrl !== undefined) {
    meta.push(`docs: ${check.docsUrl}`);
  }
  if (meta.length > 0) {
    lines.push(`_${meta.join(" · ")}_`);
    lines.push("");
  }
  return lines;
}
function llmMarkdown(report) {
  const lines = [];
  const failing = report.checks.filter((c) => c.status === "fail");
  const warning = report.checks.filter((c) => c.status === "warn");
  const host = hostOf(report.finalUrl);
  lines.push(`# AI-readiness fix plan for ${host}`);
  lines.push("");
  lines.push("## Context for the AI agent");
  lines.push("");
  lines.push(`You are an autonomous coding agent working on the codebase that serves ${report.finalUrl}. ` + `An AI-readiness audit (isready.ai, score v${report.scoreVersion}, ${report.finishedAt.slice(0, 10)}) ` + `scored this site **${report.overall}/100 (${report.grade})**. Your task is to fix the findings below ` + "so the site becomes fully readable by AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) " + "and AI search engines.");
  lines.push("");
  lines.push("Ground rules:");
  lines.push("");
  lines.push("1. Most AI crawlers do NOT execute JavaScript — every fix must land in the **server-rendered HTML**, not client-side.");
  lines.push("2. Work through findings in order (failures first, then warnings); they are sorted by impact.");
  lines.push("3. The `evidence` blocks contain the exact observed values — use them to locate the problem.");
  lines.push("4. After your changes, verify with `npx isreadyai " + host + "` (or curl the page without JS and inspect the HTML).");
  lines.push("5. Do not fabricate content: where a fix needs copy (descriptions, author names), derive it from the existing site content.");
  lines.push("");
  const ordered = [...failing, ...warning];
  if (ordered.length === 0) {
    lines.push("## Findings");
    lines.push("");
    lines.push("No failures or warnings — this site is already AI-ready. No action required.");
    lines.push("");
    return lines.join(`
`);
  }
  lines.push(`## Findings to fix (${failing.length} failed, ${warning.length} warnings)`);
  lines.push("");
  ordered.forEach((check, index) => {
    lines.push(`### ${index + 1}. [${check.status.toUpperCase()}] ${check.title}`);
    lines.push("");
    lines.push(`- **Check id:** \`${check.id}\` (category: ${check.category})`);
    lines.push(`- **Observed:** ${check.detail}`);
    if (check.fix !== undefined) {
      lines.push(`- **Required change:** ${check.fix}`);
    }
    if (check.impact !== undefined || check.effort !== undefined) {
      lines.push(`- **Priority:** impact ${check.impact ?? "n/a"}, effort ${check.effort ?? "n/a"}`);
    }
    if (check.docsUrl !== undefined) {
      lines.push(`- **Reference:** ${check.docsUrl}`);
    }
    if (check.evidence !== undefined) {
      lines.push("- **Evidence:**");
      lines.push("");
      lines.push("```json");
      lines.push(JSON.stringify(check.evidence, null, 2));
      lines.push("```");
    }
    lines.push("");
  });
  lines.push("## Acceptance criteria");
  lines.push("");
  lines.push(`- All ${failing.length} failed checks pass on re-scan.`);
  lines.push("- No previously passing check regresses.");
  lines.push("- The fixes are visible in the raw HTML response (verify with `curl`, not a browser).");
  lines.push("");
  return lines.join(`
`);
}
// packages/scanner/src/guards.ts
var GRADES = new Set(Object.values(EGrade));
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function isAuditSummary(value) {
  return isObject(value) && typeof value.url === "string" && typeof value.scoreVersion === "string" && typeof value.overall === "number" && typeof value.grade === "string" && GRADES.has(value.grade) && Array.isArray(value.categories) && typeof value.startedAt === "string" && typeof value.finishedAt === "string";
}
function isAuditReport(value) {
  return isAuditSummary(value) && typeof value.finalUrl === "string";
}
function isScanReport(value) {
  return isAuditReport(value) && Array.isArray(value.checks) && isObject(value.meta) && typeof value.meta.durationMs === "number" && typeof value.meta.fetchOk === "boolean";
}
function isSiteReport(value) {
  return isAuditSummary(value) && typeof value.discovered === "number" && isScanReport(value.primary) && Array.isArray(value.pages) && value.pages.every(isScanReport);
}
// packages/scanner/src/providers/native.ts
var MAX_BODY_BYTES = 8 * 1024 * 1024;
// packages/scanner/src/score.ts
var CATEGORY_WEIGHTS = {
  [ECategory.CRAWLER_ACCESS]: 0.25,
  [ECategory.RENDERING]: 0.2,
  [ECategory.STRUCTURED_DATA]: 0.3,
  [ECategory.TRUST]: 0.1,
  [ECategory.GEO_CONTENT]: 0.15
};

// packages/scanner/src/smart-agent/structural-cluster.ts
var VOID_ELEMENTS = new Set([
  "br",
  "img",
  "input",
  "hr",
  "meta",
  "link",
  "source",
  "area",
  "base",
  "col",
  "embed",
  "param",
  "track",
  "wbr"
]);
// packages/scanner/src/smart-agent/types.ts
var ESmartAgentCategory = {
  VISIBLE_CONTENT: "visible_content",
  UNDERSTANDABLE_STRUCTURE: "understandable_structure",
  CONTENT_QUALITY: "content_quality",
  ACCESSIBLE_CONTROLS: "accessible_controls",
  NAVIGABILITY: "navigability",
  BARRIERS: "barriers"
};
var SMART_AGENT_CATEGORY_LABELS = {
  [ESmartAgentCategory.VISIBLE_CONTENT]: "Visible content",
  [ESmartAgentCategory.UNDERSTANDABLE_STRUCTURE]: "Understandable structure",
  [ESmartAgentCategory.CONTENT_QUALITY]: "Content quality",
  [ESmartAgentCategory.ACCESSIBLE_CONTROLS]: "Accessible controls",
  [ESmartAgentCategory.NAVIGABILITY]: "Navigability",
  [ESmartAgentCategory.BARRIERS]: "Agent barriers"
};
var SMART_AGENT_CATEGORY_WEIGHTS = {
  [ESmartAgentCategory.VISIBLE_CONTENT]: 30,
  [ESmartAgentCategory.UNDERSTANDABLE_STRUCTURE]: 20,
  [ESmartAgentCategory.CONTENT_QUALITY]: 20,
  [ESmartAgentCategory.ACCESSIBLE_CONTROLS]: 15,
  [ESmartAgentCategory.NAVIGABILITY]: 10,
  [ESmartAgentCategory.BARRIERS]: 5
};
var ESmartAgentStatus = {
  PASS: EStatus.PASS,
  WARN: EStatus.WARN,
  FAIL: EStatus.FAIL
};
// packages/scanner/src/smart-agent/analyze.ts
var INTERACTIVE_ROLES = new Set([
  "button",
  "checkbox",
  "combobox",
  "link",
  "menuitem",
  "option",
  "radio",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "textbox"
]);
// apps/cli/src/from-json.ts
var file = process.argv[2];
if (file === undefined) {
  process.stderr.write(`usage: from-json <report.json> [--llm]
`);
  process.exit(2);
}
var mode = process.argv.includes("--llm") ? "llm" : "human";
var parsed = JSON.parse(await readFile(file, "utf8"));
if (isSiteReport(parsed)) {
  process.stdout.write(`${reportToMarkdown(parsed, mode)}
`);
} else if (isScanReport(parsed)) {
  process.stdout.write(`${reportToMarkdown(parsed, mode)}
`);
} else {
  process.stderr.write(`error: ${file} is not an isreadyai --json report
`);
  process.exit(2);
}
