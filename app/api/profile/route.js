import { getPSN } from "../../../lib/psn";

// This function "caches" the image into a text string (Base64)
async function getBase64Image(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/png";
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (e) {
    // Fallback to a default image if the PSN link is broken
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");
    const format = searchParams.get("format");

    if (!user) return new Response("User required", { status: 400 });

    const data = await getPSN(user);

    // Only do the heavy SVG/Base64 work if format=svg is requested
    if (format === "svg") {
      const statusColor = data.status === "Online" ? "#2cff88" : data.status === "Away" ? "#ffaa00" : "#ff4d4d";
      const gameText = (data.game?.name || data.game || "Idle").replace(/&/g, "&amp;");
      
      // We "cache" the avatar into the response here
      const avatarDataUri = await getBase64Image(data.avatar);

      const svg = `
      <svg width="600" height="160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0a0f2c"/>
            <stop offset="100%" stop-color="#1b2a6b"/>
          </linearGradient>
          <clipPath id="circle">
            <circle cx="80" cy="80" r="40" />
          </clipPath>
        </defs>

        <rect width="100%" height="100%" rx="20" fill="url(#bg)" />
        <rect x="0" y="0" width="6" height="100%" fill="#2f80ff" />

        <image href="${avatarDataUri}" x="40" y="40" width="80" height="80" clip-path="url(#circle)" />

        <text x="150" y="55" fill="#ffffff" font-family="Arial, sans-serif" font-size="22" font-weight="bold">
          ${data.username || user}
        </text>

        <circle cx="155" cy="78" r="5" fill="${statusColor}" />
        <text x="170" y="83" fill="#cfd8ff" font-family="Arial, sans-serif" font-size="14">
          ${data.status || "Unknown"}
        </text>

        <text x="150" y="110" fill="#9fb3ff" font-family="Arial, sans-serif" font-size="16">
          🎮 ${gameText}
        </text>

        <text x="150" y="138" font-family="Arial, sans-serif" font-size="14">
          <tspan fill="#ffffff">🏆</tspan> <tspan fill="#e5e4e2">${data.trophies?.platinum || 0}</tspan>
          <tspan fill="#ffd700" dx="10">🥇</tspan> <tspan fill="#ffffff">${data.trophies?.gold || 0}</tspan>
          <tspan fill="#c0c0c0" dx="10">🥈</tspan> <tspan fill="#ffffff">${data.trophies?.silver || 0}</tspan>
          <tspan fill="#cd7f32" dx="10">🥉</tspan> <tspan fill="#ffffff">${data.trophies?.bronze || 0}</tspan>
        </text>
      </svg>`;

      return new Response(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
        },
      });
    }

    // Default: Return JSON for your website
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}