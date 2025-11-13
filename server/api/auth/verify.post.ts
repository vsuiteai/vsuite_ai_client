import {
  verify_client,
  init_client_onboarding,
  get_client_verificatn_by_verificatn_token,
  get_client_by_id,
} from "~/server/controller/clientCont";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const token = body.token ?? "";

    if (token === "") {
      throw new Error("token missing");
    }

    let get_client_ver = await get_client_verificatn_by_verificatn_token(token);

    // console.log(get_client_ver);

    if (!get_client_ver) {
      throw new Error("Could not retrieve client verification data");
    }

    let get_client_to_be_verified = await get_client_by_id(
      get_client_ver.cl_ver_client_id
    );

    if (!get_client_to_be_verified) {
      throw new Error("Could not retrieve client data");
    }

    if (get_client_to_be_verified.client_is_verified) {
      throw new Error("You have already been verified");
    }

    await verify_client(get_client_ver.cl_ver_client_id, token);
    await init_client_onboarding(get_client_ver);

    get_client_to_be_verified = await get_client_by_id(
      get_client_ver.cl_ver_client_id
    );

    return {
      error: false,
      data: get_client_to_be_verified,
      message: "client verified",
    };
  } catch (err) {
    console.log(err);

    if (err instanceof Error) {
      return {
        error: true,
        data: null,
        message: err.message,
      };
    } else {
      return {
        error: true,
        data: null,
        message: String(err),
      };
    }
  }
});
