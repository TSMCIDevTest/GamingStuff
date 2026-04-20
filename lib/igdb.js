import fetch from "node-fetch";
async function getTwitchToken() {
  if (tokenCache) return tokenCache;

  const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, {
    method: "POST"
  });

  const data = await res.json();
  tokenCache = data.access_token;
  return tokenCache;
}

export async function getGameData(name) {
  if (!name) return {};

  const token = await getTwitchToken();

  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${token}`
    },
    body: `search "${name}"; fields name,cover.url,videos.video_id; limit 1;`
  });

  const data = await res.json();
  const game = data[0];

  return {
    cover: game?.cover?.url?.replace("t_thumb", "t_1080p"),
    video: game?.videos?.[0]
      ? `https://www.youtube.com/embed/${game.videos[0].video_id}`
      : null
  };
}