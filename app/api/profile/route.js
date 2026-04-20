import { getPSN } from "../../../lib/psn";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");

  const data = await getPSN(user);

  const statusColor =
    data.status === "Online" ? "#2cff88" :
    data.status === "Away" ? "#ffaa00" :
    "#ff4d4d";

  const gameText = data.game || "Idle";

  const svg = `
  <svg width="600" height="160" xmlns="http://www.w3.org/2000/svg">

    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a0f2c"/>
        <stop offset="100%" stop-color="#1b2a6b"/>
      </linearGradient>

      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#2f80ff"/>
        <stop offset="100%" stop-color="#56ccf2"/>
      </linearGradient>

      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="100%" height="100%" rx="20" fill="url(#bg)" />

    <!-- Accent bar -->
    <rect x="0" y="0" width="6" height="100%" fill="url(#accent)" />

    <!-- Avatar -->
    <clipPath id="circle">
      <circle cx="80" cy="80" r="40" />
    </clipPath>

    <image href="${data.avatar}" x="40" y="40" width="80" height="80" clip-path="url(#circle)" />

    <!-- Username -->
    <text x="150" y="60" fill="#ffffff" font-size="22" font-family="Arial" font-weight="bold">
      ${data.username}
    </text>

    <!-- Status -->
    <circle cx="150" cy="80" r="6" fill="${statusColor}" filter="url(#glow)" />
    <text x="165" y="85" fill="#cfd8ff" font-size="14">
      ${data.status}
    </text>

    <!-- Game -->
    <text x="150" y="110" fill="#9fb3ff" font-size="16">
      🎮 ${gameText}
    </text>

    <!-- Trophy stats -->
    <text x="150" y="135" fill="#ffd700" font-size="14">
      🏆 ${data.trophies?.platinum || 0}  🥇 ${data.trophies?.gold || 0}  🥈 ${data.trophies?.silver || 0}  🥉 ${data.trophies?.bronze || 0}
    </text>

  </svg>
  `;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
    }
  });
}