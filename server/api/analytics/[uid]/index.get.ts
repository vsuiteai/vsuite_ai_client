import { get_submissions_stat } from "~/server/controller/formCont";
import { get_client_files_by_uuid_with_pagination } from "~/server/controller/clientFilesCont";
import { get_queries_by_client_uid_with_pagination } from "~/server/controller/queryCont";
import { getSuccessfullyRanPromptStats } from "~/server/controller/promptStatCont";
import { get_client_by_uuid } from "~/server/controller/clientCont";

export default defineEventHandler(async (event) => {
  try {
    const page = 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const uid = getRouterParam(event, "uid") ?? false;

    if (!uid) throw new Error("client uid not provided");

    const submissions_stats = await get_submissions_stat({ client_uid: uid });
    const queries = await get_queries_by_client_uid_with_pagination(uid);
    const { total: total_files } =
      await get_client_files_by_uuid_with_pagination(limit, offset, uid);
    let successfully_ran_queries_count = 0;

    const client = await get_client_by_uuid(uid);

    if (client) {
      const client_id = client.client_id ?? false;
      successfully_ran_queries_count = client_id
        ? await getSuccessfullyRanPromptStats(client_id)
        : 0;
    }

    // console.log(successfully_ran_queries_count);

    return {
      error: false,
      data: {
        total_files: total_files,
        total_queries: queries,
        submissions_stats: submissions_stats,
        ai_query_count: successfully_ran_queries_count,
      },
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
