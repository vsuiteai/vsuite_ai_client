import { get_client_by_uuid } from "~/server/controller/clientCont";
import { get_activities } from "~/server/controller/activityLogCont";

export default defineEventHandler(async (event) => {
  try {
    const uid = getRouterParam(event, "uid") ?? false;

    if (!uid) throw new Error("client uid not provided");

    const client = await get_client_by_uuid(uid);

    if (!client) throw new Error("client not found");

    const client_id = client.client_id ?? false;

    if (!client_id) throw new Error("unable to resolve client");

    const activities = await get_activities(client_id);

    return {
      error: false,
      data: activities,

      message: "activities fetched successfully",
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
