import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getProfileFromUserName
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

  const presence = profile.profile.presences?.[0];

  return {
    username: profile.profile.onlineId,
    avatar: profile.profile.avatarUrls[0].avatarUrl,
    status: presence?.onlineStatus || "Offline",
    game: presence?.gameTitleInfoList?.[0]?.titleName || null,
    lastSeen: presence?.lastOnlineDate || "Unknown",
    level: profile.profile.trophySummary.level,
    progress: profile.profile.trophySummary.progress,
    trophies: profile.profile.trophySummary.earnedTrophies
  };
}