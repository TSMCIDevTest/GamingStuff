export default async function handler(req, res) {
  const { getPSN } = await import("../lib/psn.js");

  const user = req.query.user;
  const data = await getPSN(user);

  const text = data.game
    ? `🎮 Playing ${data.game} — ${data.status}`
    : `💤 Offline — Last seen ${data.lastSeen}`;

  const svg = `
  <svg width="600" height="40" xmlns="http://www.w3.org/2000/svg">
    <style>
      .text { fill: #fff; font-size: 16px; font-family: Arial; }
    </style>
    <rect width="100%" height="100%" fill="#0a0f2c"/>
    <text class="text" y="25">
      <animate attributeName="x" from="600" to="-1000" dur="12s" repeatCount="indefinite"/>
      ${text}
    </text>
  </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
}