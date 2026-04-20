import { getPSN } from "../../../lib/psn";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");
    const format = searchParams.get("format"); // Check for ?format=svg

    if (!user) {
      return new Response(JSON.stringify({ error: "User required" }), { status: 400 });
    }

    const data = await getPSN(user);

    // --- FEATURE: SVG GENERATION (For GitHub README) ---
    if (format === "svg") {
      const statusColor =
        data.status === "Online" ? "#2cff88" :
        data.status === "Away" ? "#ffaa00" :
        "#ff4d4d";

      const gameText = data.game?.name || data.game || "Idle";
      const avatar = data.avatar || "https://www.playstation.com/content/dam/global_assets/dotcom/support/images/psn/psn-icon.png";

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

        <rect width="100%" height="100%" rx="20" fill="url(#bg)" />
        <rect x="0" y="0" width="6" height="100%" fill="url(#accent)" />

        <clipPath id="circle">
          <circle cx="80" cy="80" r="40" />
        </clipPath>

        <image href="${avatar}" x="40" y="40" width="80" height="80" clip-path="url(#circle)" />

        <text x="150" y="60" fill="#ffffff" font-size="22" font-family="Arial, sans-serif" font-weight="bold">
          ${data.username || user}
        </text>

        <circle cx="150" cy="80" r="6" fill="${statusColor}" filter="url(#glow)" />
        <text x="165" y="85" fill="#cfd8ff" font-size="14" font-family="Arial, sans-serif">
          ${data.status || "Unknown"}
        </text>

        <text x="150" y="110" fill="#9fb3ff" font-size="16" font-family="Arial, sans-serif">
          🎮 ${gameText}
        </text>

        <text x="150" y="135" fill="#ffd700" font-size="14" font-family="Arial, sans-serif">
          🏆 ${data.trophies?.platinum || 0}  🥇 ${data.trophies?.gold || 0}  🥈 ${data.trophies?.silver || 0}  🥉 ${data.trophies?.bronze || 0}
        </text>
      </svg>`;

      return new Response(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
        },
      });
    }

    // --- FEATURE: JSON RESPONSE (For your page.jsx) ---
    return new Response(JSON.stringify(data), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
      },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch PSN data" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}