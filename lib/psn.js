import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getProfileFromUserName,
  getUserTitles
} from "psn-api";

let auth;

async function getAuth() {
  if (!auth) {
    const code = await exchangeNpssoForAccessCode(process.env.NPSSO);
    auth = await exchangeAccessCodeForAuthTokens(code);
  }
  return auth;
}

export async function getPSN(username) {
  const a = await getAuth();
  const profile = await getProfileFromUserName(a, username);
  const titles = await getUserTitles(a, profile.profile.accountId);

  return {
    username: profile.profile.onlineId,
    avatar: profile.profile.avatarUrls[0].avatarUrl,
    status: profile.profile.presences?.[0]?.onlineStatus,
    game: profile.profile.presences?.[0]?.gameTitleInfoList?.[0]?.titleName,
    lastSeen: profile.profile.presences?.[0]?.lastOnlineDate,
    level: profile.profile.trophySummary.level,
    progress: profile.profile.trophySummary.progress,
    trophies: profile.profile.trophySummary.earnedTrophies,
    titles: titles.trophyTitles.slice(0, 5)
  };
}