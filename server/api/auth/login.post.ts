import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { get_client_by_email } from "~/server/controller/clientCont";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const client_username = body.client_username ?? "";
  const client_password = body.client_password ?? "";

  if (client_username === "" || client_password === "") {
    throw new Error("Required detail(s) missing");
  }

  const client = await get_client_by_email(client_username);

  if (!client)
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });

  const fetched_client_password = client?.client_password ?? "";

  if (!fetched_client_password)
    throw createError({
      statusCode: 401,
      statusMessage: "Client Password not set",
    });

  const isMatch = await bcrypt.compare(
    client_password,
    fetched_client_password
  );

  if (!isMatch) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

  await setUserSession(event, {
    user: {
      ...client,
    },
  });
  return { message: "Login successful" };
});
