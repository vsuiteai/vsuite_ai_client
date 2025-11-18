import jwt from "jsonwebtoken";
import { get_client_by_uuid } from "~/server/controller/clientCont";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const client_uid = user.client_uid ?? false;

  if (!client_uid) {
    throw new Error("Required detail(s) missing");
  }

  const client = await get_client_by_uuid(client_uid);

  if (!client) {
    throw createError({
      statusCode: 401,
      statusMessage: "client not found",
    });
  }

  await setUserSession(event, {
    user: {
      ...client,
    },
  });
  return {};
});
