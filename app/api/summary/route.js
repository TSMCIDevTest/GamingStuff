import { getPSN } from "../../../psn";
import { generateSummary } from "../../../lib/ai";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");

  const data = await getPSN(user);
  const summary = generateSummary(data);

  return Response.json({ summary });
}