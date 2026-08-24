/** Brand colors + logo domains for story thumbnails */

export type BrandMark = {
  label: string;
  bg: string;
  fg: string;
  domain?: string;
};

const BRANDS: Record<string, BrandMark> = {
  anthropic: { label: "A", bg: "#D4A27F", fg: "#1a1a1a", domain: "anthropic.com" },
  openai: { label: "O", bg: "#10a37f", fg: "#ffffff", domain: "openai.com" },
  google: { label: "G", bg: "#4285F4", fg: "#ffffff", domain: "google.com" },
  deepmind: { label: "DM", bg: "#4285F4", fg: "#ffffff", domain: "deepmind.google" },
  nvidia: { label: "N", bg: "#76B900", fg: "#0a0a0a", domain: "nvidia.com" },
  databricks: { label: "DB", bg: "#FF3621", fg: "#ffffff", domain: "databricks.com" },
  meta: { label: "M", bg: "#0668E1", fg: "#ffffff", domain: "meta.com" },
  microsoft: { label: "MS", bg: "#00A4EF", fg: "#ffffff", domain: "microsoft.com" },
  amazon: { label: "AZ", bg: "#FF9900", fg: "#0a0a0a", domain: "amazon.com" },
  apple: { label: "", bg: "#555555", fg: "#ffffff", domain: "apple.com" },
  mistral: { label: "Mi", bg: "#FF7000", fg: "#ffffff", domain: "mistral.ai" },
  cohere: { label: "Co", bg: "#39594D", fg: "#ffffff", domain: "cohere.com" },
  huggingface: { label: "HF", bg: "#FFD21E", fg: "#0a0a0a", domain: "huggingface.co" },
  payhawk: { label: "P", bg: "#5B4CFF", fg: "#ffffff", domain: "payhawk.com" },
  "uc berkeley": { label: "Cal", bg: "#003262", fg: "#FDB515", domain: "berkeley.edu" },
  berkeley: { label: "Cal", bg: "#003262", fg: "#FDB515", domain: "berkeley.edu" },
  "agentic ai foundation": { label: "AA", bg: "#2563eb", fg: "#ffffff", domain: "modelcontextprotocol.io" },
  "model context protocol": { label: "MCP", bg: "#111827", fg: "#60a5fa", domain: "modelcontextprotocol.io" },
  mcp: { label: "MCP", bg: "#111827", fg: "#60a5fa", domain: "modelcontextprotocol.io" },
};

const COUNTRY: Record<string, BrandMark> = {
  US: { label: "US", bg: "#1e3a5f", fg: "#ffffff" },
  GB: { label: "UK", bg: "#012169", fg: "#ffffff" },
  UK: { label: "UK", bg: "#012169", fg: "#ffffff" },
  EU: { label: "EU", bg: "#003399", fg: "#FFCC00" },
  CN: { label: "CN", bg: "#DE2910", fg: "#FFDE00" },
  JP: { label: "JP", bg: "#BC002D", fg: "#ffffff" },
  IN: { label: "IN", bg: "#FF9933", fg: "#138808" },
  DE: { label: "DE", bg: "#000000", fg: "#DD0000" },
  FR: { label: "FR", bg: "#002395", fg: "#ffffff" },
  CA: { label: "CA", bg: "#FF0000", fg: "#ffffff" },
  AU: { label: "AU", bg: "#00008B", fg: "#ffffff" },
  KR: { label: "KR", bg: "#003478", fg: "#ffffff" },
};

export function resolveBrandMark(
  organization: string[] = [],
  country_code?: string
): BrandMark {
  for (const org of organization) {
    const key = org.toLowerCase().trim();
    if (BRANDS[key]) return BRANDS[key];
    for (const [k, v] of Object.entries(BRANDS)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
  }
  if (country_code && country_code !== "GLOBAL" && COUNTRY[country_code]) {
    return COUNTRY[country_code];
  }
  const initial = (organization[0]?.[0] || "AI").toUpperCase();
  return { label: initial.slice(0, 2), bg: "#3b82f6", fg: "#ffffff" };
}

/** High-res favicon/logo via Google — works for most public domains */
export function brandLogoUrl(domain?: string, size = 128): string | null {
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}
