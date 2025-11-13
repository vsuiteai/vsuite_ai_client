import { get_queries_by_client_uid_with_pagination } from "~/server/controller/queryCont";

export default defineEventHandler(async (event) => {
  try {
    const client_uid = getRouterParam(event, "uid") ?? false;
    const query = getQuery(event);

    const endBefore = query.endBefore?.toString() ?? null;
    const startAfter = query.startAfter?.toString() ?? null;

    // console.log("endBefore ");
    // console.log(endBefore);
    // console.log("startAfter ");
    // console.log(startAfter);

    if (!client_uid) throw new Error("client uid not provided");

    const queries = await get_queries_by_client_uid_with_pagination(
      client_uid,
      endBefore,
      startAfter
    );

    return {
      error: false,
      data: {
        queries,
      },
      message: "Clients fetched successfully",
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
