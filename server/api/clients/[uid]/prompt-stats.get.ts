import { getPromptStats } from "~/server/controller/promptStatCont";
import { get_client_by_uuid } from "~/server/controller/clientCont";

export default defineEventHandler(async (event) => {
  try {
    const uid = getRouterParam(event, "uid") ?? false;

    if (!uid) throw new Error("client uid not provided");

    const client = await get_client_by_uuid(uid);

    if (!client) throw new Error("client not found");

    const client_id = client.client_id ?? false;

    if (!client_id) throw new Error("unable to resolve client");

    const promptStatCont = await getPromptStats(client_id);

    // console.log(promptStatCont);

    return {
      error: false,
      data: promptStatCont,
      message: "analytics fetched successfully",
    };
  } catch (err) {
    console.log(err instanceof Error ? err.message : String(err));
    return {
      error: true,
      data: null,
      message: err instanceof Error ? err.message : String(err),
    };
  }
});

function generatePageNumbers(
  current: number,
  total: number
): (number | string)[] {
  const range = [];
  const delta = 2; // Show current +/- 2 pages
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("...");

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) range.push("...");
  if (total > 1) range.push(total);

  return range;
}
