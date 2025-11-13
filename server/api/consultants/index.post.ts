import { v4 as uuidv4 } from "uuid";
import {
  get_consultant_by_email,
  create_consultant,
} from "~/server/controller/consultantCont";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const consultant_first_name = body?.consultant_first_name ?? "";
    const consultant_last_name = body?.consultant_last_name ?? "";
    const consultant_role = body?.consultant_role ?? "";
    const consultant_home_address = body?.consultant_home_address ?? "";
    const consultant_email = body?.consultant_email ?? "";
    const consultant_password = body?.consultant_password ?? "";
    const is_active = body?.is_active ?? null;

    if (
      consultant_first_name === "" ||
      consultant_last_name === "" ||
      consultant_role === "" ||
      consultant_home_address === "" ||
      consultant_email === "" ||
      consultant_password === ""
    ) {
      throw new Error("Required detail(s) missing");
    }

    let email_is_a_duplicate = await get_consultant_by_email(consultant_email);

    if (email_is_a_duplicate) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(consultant_password, 10);

    const res = await create_consultant({
      consultant_first_name: consultant_first_name,
      consultant_last_name: consultant_last_name,
      consultant_role: consultant_role,
      consultant_home_address: consultant_home_address,
      consultant_email: consultant_email,
      consultant_password: hashedPassword,
    });

    return {
      error: false,
      data: res,
      message: "consultant created",
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
