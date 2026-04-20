import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getProfileFromUserName,
  getUserTitles
} from "psn-api";

import { getGameData } from "../../../lib/rawg";

let auth;

async function getAuth() {
  if (!auth) {
    const code = await exchangeNpssoForAccessCode(process.env.NPSSO);
    auth = await exchangeAccessCodeForAuthTokens(code);
  }
  return auth;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("user");

    // ✅ prevent crash
    if (!username) {
      return Response.json(
        { error: "Missing ?user parameter" },
        { status: 400 }
      );
    }

    const a = await getAuth();

    const profile = await getProfileFromUserName(a, username);

    // ✅ safe access
    const presence = profile.profile.presences?.[0] || {};
    const trophySummary = profile.profile.trophySummary || {};
    const avatar = profile.profile.avatarUrls?.[0]?.avatarUrl;

    const titles = await getUserTitles(a, profile.profile.accountId);

    const gameName =
      presence.gameTitleInfoList?.[0]?.titleName || null;

    const gameData = await getGameData(gameName);

    return Response.json(
      {
        username: profile.profile.onlineId,
        avatar: avatar || null,
        status: presence.onlineStatus || "Offline",

        game: {
          name: gameName,
          cover: gameData.cover || null,
          video: gameData.video || null
        },

        level: trophySummary.level || 0,
        progress: trophySummary.progress || 0,
        trophies: trophySummary.earnedTrophies || {
          platinum: 0,
          gold: 0,
          silver: 0,
          bronze: 0
        },

        trophyTitles: (titles.trophyTitles || [])
          .slice(0, 8)
          .map((t) => ({
            name: t.trophyTitleName,
            icon: t.trophyTitleIconUrl,
            progress: t.progress
          }))
      },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
        }
      }
    );
  } catch (err) {
    console.error("PSN API error:", err);

    return Response.json(
      { error: "Failed to fetch PSN data" },
      { status: 500 }
    );
  }
}