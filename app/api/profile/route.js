import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getProfileFromUserName,
  getUserTitles
} from "psn-api";

import { getGameData } from "@/lib/igdb";

let auth;

async function getAuth() {
  if (!auth) {
    const code = await exchangeNpssoForAccessCode(process.env.NPSSO);
    auth = await exchangeAccessCodeForAuthTokens(code);
  }
  return auth;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("user");

  const a = await getAuth();
  const profile = await getProfileFromUserName(a, username);
  const titles = await getUserTitles(a, profile.profile.accountId);

  const gameName = profile.profile.presences?.[0]?.gameTitleInfoList?.[0]?.titleName;
  const igdb = await getGameData(gameName);

  return Response.json({
    username: profile.profile.onlineId,
    avatar: profile.profile.avatarUrls[0].avatarUrl,
    status: profile.profile.presences?.[0]?.onlineStatus,
    game: {
      name: gameName,
      cover: igdb.cover,
      video: igdb.video
    },
    level: profile.profile.trophySummary.level,
    progress: profile.profile.trophySummary.progress,
    trophies: profile.profile.trophySummary.earnedTrophies,
    trophyTitles: titles.trophyTitles.slice(0,8).map(t => ({
      name: t.trophyTitleName,
      icon: t.trophyTitleIconUrl,
      progress: t.progress
    }))
  }, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
    }
  });
}