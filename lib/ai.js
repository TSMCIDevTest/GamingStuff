export function generateSummary(data) {
  if (!data.game) return "Taking a break lately...";

  if (data.level > 300) {
    return `You're a hardcore grinder. ${data.game} is just another conquest.`;
  }

  if (/call of duty/i.test(data.game)) {
    return "Locked into shooters—fast reflex gameplay.";
  }

  if (/elden|souls/i.test(data.game)) {
    return "Grinding difficult RPGs—skill and patience.";
  }

  return `You've been spending time in ${data.game}. Solid progress.`;
}