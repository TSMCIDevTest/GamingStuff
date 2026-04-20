export default async function handler(req, res) {
  const { getPSN } = await import("../lib/psn.js");
  const { getGameData } = await import("../lib/igdb.js");

  const user = req.query.user;
  const psn = await getPSN(user);

  const games = [psn.game]; // expand later with recent titles

  const covers = await Promise.all(
    games.map(async g => {
      const data = await getGameData(g);
      return data.cover;
    })
  );

  const images = covers.filter(Boolean);

  const svg = `
  <svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
    ${images.map((img, i) => `
      <image href="${img}" width="600" height="200">
        <animate attributeName="x"
          values="${i*600};${(i-1)*600}"
          dur="10s"
          repeatCount="indefinite"/>
      </image>
    `).join("")}
  </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
}