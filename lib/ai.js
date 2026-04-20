export function generateSummary(data) {
  const game = data.game || "different games";
  const level = data.level;

  if (!game) return "You’ve been pretty quiet lately… taking a break?";

  if (level > 300) {
    return `You’re a hardcore grinder. ${game} is just another conquest at this point.`;
  }

  if (game.toLowerCase().includes("call of duty")) {
    return "You’ve been locked into shooters lately—fast reflexes and constant action.";
  }

  if (game.toLowerCase().includes("elden")) {
    return "You’ve been grinding tough RPGs… patience and skill are carrying you.";
  }

  if (game.toLowerCase().includes("grand theft auto") || game.toLowerCase().includes("gta")) {
    return "You’ve been grinding in the criminal underworld… strategy and skill are key.";
  }

  return `You’ve been spending time in ${game}—nice balance of play and progression.`;
}