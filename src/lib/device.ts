// src/lib/device.ts

/** Coarse device class from a raw User-Agent string. */
function classifyDevice(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

/** Best-effort browser name + version from a raw User-Agent string. */
function classifyBrowser(ua: string): string {
  const patterns: [RegExp, string][] = [
    [/edg\/([\d.]+)/i, "Edge"],
    [/opr\/([\d.]+)/i, "Opera"],
    [/chrome\/([\d.]+)/i, "Chrome"],
    [/firefox\/([\d.]+)/i, "Firefox"],
    [/version\/([\d.]+).*safari/i, "Safari"],
  ];
  for (const [pattern, name] of patterns) {
    const match = ua.match(pattern);
    if (match) return `${name} ${match[1]}`;
  }
  return "Unknown";
}

export function parseDevice(userAgent: string): { device: string; browser: string } {
  return { device: classifyDevice(userAgent), browser: classifyBrowser(userAgent) };
}
