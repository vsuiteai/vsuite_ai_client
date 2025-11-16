import fs from "fs";
import formidable, { Fields, Files, File } from "formidable";
import { promisify } from "util";

import { get_client_logo_url_by_uuid_and_url } from "~/server/controller/clientFilesCont";
import {
  get_client_by_uuid,
  update_client_by_uuid,
} from "~/server/controller/clientCont";
import { storage, bucket, logoBucketName } from "~/server/cloud_storage/gcp";

const upload_new_file_to_cloud_storage = async (
  client_uid: string,
  uploadedFile: File
) => {
  let destination: string = "";
  let unique_finalPublicUrl_found: boolean = false;

  while (!unique_finalPublicUrl_found) {
    const file_GCS_name = `${Date.now()}_${uploadedFile.originalFilename}`;
    const temp_destination = `uploads/${client_uid}/${file_GCS_name}`;

    const publicUrl = `https://storage.googleapis.com/${logoBucketName}/${temp_destination}`;

    const file_with_same_name =
      (await get_client_logo_url_by_uuid_and_url(client_uid, publicUrl)) ??
      false;

    if (!file_with_same_name) {
      unique_finalPublicUrl_found = true;
      destination = temp_destination;
    }
  }
  // vsuite-client-logos
  const bucket = storage.bucket(logoBucketName);
  console.log("nbnnbn");

  const fileCreateionRes = await bucket.upload(uploadedFile.filepath, {
    destination,
    resumable: false,
    contentType: uploadedFile.mimetype || undefined,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  // Make the uploaded file public
  // const file = bucket.file(destination);
  // await file.makePublic();

  const file_url = fileCreateionRes[0].publicUrl();

  console.log(file_url);

  return file_url;
};

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

  const { fields, files } = await parseForm();

  // Handle single file case
  const fileData = files.client_logo;
  const uploadedFile = Array.isArray(fileData)
    ? fileData[0]
    : fileData ?? undefined;

  const company_name = Array.isArray(fields.company_name)
    ? fields.company_name[0]
    : fields.company_name;
  const contact_name = Array.isArray(fields.contact_name)
    ? fields.contact_name[0]
    : fields.contact_name;
  const client_contact_work_email = Array.isArray(
    fields.client_contact_work_email
  )
    ? fields.client_contact_work_email[0]
    : fields.client_contact_work_email;
  const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
  const contact_role = Array.isArray(fields.contact_role)
    ? fields.contact_role[0]
    : fields.contact_role;
  const client_industry = Array.isArray(fields.client_industry)
    ? fields.client_industry[0]
    : fields.client_industry;

  const client = await get_client_by_uuid(uid);
  const file_owner = client?.client_id ?? "";
  if (file_owner === "") {
    throw createError({
      statusCode: 400,
      statusMessage: "File owner not found",
    });
  }

  const updated_client_details: ClientDetail = {
    client_id: client?.client_id,
    client_uid: client?.client_uid,
    client_company_name: company_name
      ? company_name
      : client?.client_company_name!,
    client_contact_fullname: contact_name
      ? contact_name
      : client?.client_contact_fullname!,
    client_contact_phone: phone ? phone : client?.client_contact_phone!,
    client_contact_work_email: client_contact_work_email
      ? client_contact_work_email
      : client?.client_contact_work_email!,
    client_contact_role: contact_role
      ? contact_role
      : client?.client_contact_role!,
    client_is_verified: client?.client_is_verified!,
    client_created_at: client?.client_created_at,
    client_updated_at: client?.client_updated_at,
    client_password: client?.client_password,
    onboarding_process_status: client?.onboarding_process_status!,
    client_industry: client_industry
      ? client_industry
      : client?.client_industry,
    status: client?.status,
    last_activity: client?.last_activity,
    client_logo_url: client?.client_logo_url,
  };

  if (uploadedFile && uploadedFile.filepath && uploadedFile.originalFilename) {
    console.log("hhhvhv");

    const file_url = await upload_new_file_to_cloud_storage(uid, uploadedFile);

    updated_client_details.client_logo_url = file_url;
  }

  // update client
  update_client_by_uuid(uid, updated_client_details);
  return {
    message: "Client updated successfully",
  };
});
