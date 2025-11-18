import fs from "fs";
import formidable, { Fields, Files, File } from "formidable";
import { promisify } from "util";
import bcrypt from "bcrypt";

import {
  get_client_by_uuid,
  update_client_password_by_uuid,
} from "~/server/controller/clientCont";
import { parent_routes } from "~/config/parent_routes";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default defineEventHandler(async (event) => {
  const uid = getRouterParam(event, "uid") ?? false;

  if (!uid) throw new Error("client uid not provided");
  const form = formidable({ keepExtensions: true });

  const parseForm = (): Promise<{ fields: Fields; files: Files }> =>
    new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

  const { fields } = await parseForm();

  const client_password =
    (Array.isArray(fields.password) ? fields.password[0] : fields.password) ??
    "";

  if (client_password === "") {
    throw new Error("Required detail(s) missing");
  }

  const client = await get_client_by_uuid(uid);
  const resolved_client = client?.client_id ?? "";

  if (resolved_client === "") {
    throw createError({
      statusCode: 400,
      statusMessage: "client not found",
    });
  }

  const hashedPassword = await bcrypt.hash(client_password, 10);

  console.log(client_password);
  console.log(hashedPassword);

  const updated_client = await update_client_password_by_uuid(
    uid,
    hashedPassword
  );

  // destroy current session
  await clearUserSession(event);

  return {
    message: "Client updated successfully",
    client: updated_client,
  };
});
