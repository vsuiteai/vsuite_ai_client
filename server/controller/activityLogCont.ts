import { firestore_db } from "~/server/firebase/firebase-admin";
import type {
  actions,
  activity,
  resources,
  resource_meta,
} from "../../types/activities";
import { get_client_by_id, get_client_by_uuid } from "./clientCont";

const add_verify_post_activity = async (client_id: string) => {
  const client = await get_client_by_id(client_id);

  if (!client) return;

  const actor: resource_meta = {
    resource_id: "admin",
    resouce_type: "admin",
    resource_name: "admin",
  };

  const target: resource_meta = {
    resource_id: client.client_id!,
    resouce_type: "client",
    resource_name: client.client_company_name,
  };

  const action: actions = "verified_primary_contact_email";

  const activity = {
    key_variables__client_involved: {
      client_id: client.client_id!,
      client_name: client.client_company_name,
    },
    actor: actor,
    action: action,
    target: target,
    timestamp: new Date().toISOString(),
  };

  await add_activity(activity);
};

const add_questionaire_submission_activity = async (
  client_uid: string,
  questionaire_id: string,
  form_type: client_form_types
) => {
  const client = await get_client_by_uuid(client_uid);

  if (!client) return;

  const actor: resource_meta = {
    resource_id: client.client_id!,
    resouce_type: "client",
    resource_name: client.client_company_name,
  };

  const target: resource_meta = {
    resource_id: questionaire_id,
    resouce_type: "questionaire",
    resource_name: form_type,
  };

  let action: actions | null = null;

  switch (form_type) {
    case "advisior_onboarding_form":
      action = "submitted_advisior_onboarding";
      break;

    case "client_onboarding_form":
      action = "submitted_ceo_onboarding";
      break;
  }

  if (!action) return;

  const activity = {
    key_variables__client_involved: {
      client_id: client.client_id!,
      client_name: client.client_company_name,
    },
    actor: actor,
    action: action,
    target: target,
    timestamp: new Date().toISOString(),
  };

  await add_activity(activity);
};

const add_create_client_file_activity = async (
  client_file_details: ClientUploadedFile,
  file_id: string
) => {
  const client = await get_client_by_id(client_file_details.file_owner);
  if (!client) return;

  const actor: resource_meta = {
    resource_id: client.client_id!,
    resouce_type: "client",
    resource_name: client.client_company_name,
  };

  const target: resource_meta = {
    resource_id: file_id,
    resouce_type: "file",
    resource_name: client_file_details.file_original_name,
  };

  let action: actions = "uploaded_a_file";

  const activity = {
    key_variables__client_involved: {
      client_id: client.client_id!,
      client_name: client.client_company_name,
    },
    actor: actor,
    action: action,
    target: target,
    timestamp: new Date().toISOString(),
  };

  await add_activity(activity);
};

const add_activity = async (activity: activity) => {
  let collection = firestore_db.collection("activity_log");

  const snapshot = await collection.add({
    key_variables__client_involved: activity.key_variables__client_involved,
    actor: activity.actor,
    action: activity.action,
    target: activity.target,
    timestamp: activity.timestamp,
    created_at: new Date(),
  });

  // console.log(snapshot.id);

  return snapshot.id;
};

const get_activities = async (
  client_id: string,
  limit = 10,
  startAfter = null,
  endBefore = null
) => {
  let collection = firestore_db.collection("activity_log");

  let query = collection
    .where("key_variables__client_involved.client_id", "==", client_id)
    .orderBy("created_at", "desc")
    .limit(limit);

  // If lastVisible is provided, start after it
  if (startAfter) {
    query = query.startAfter(startAfter);
  }

  if (endBefore) {
    query = query.endBefore(endBefore);
  }

  const snapshot = await query.get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return { activities: [], startAfter: null, endBefore: null };
  }

  const activities = snapshot.docs.map((doc) => {
    const data = doc.data();
    const createdAt = data.created_at?.toDate(); // Firestore Timestamp to JS Date

    // Format date like "Date: January 1, 2022"
    const formattedDate = createdAt
      ? `${createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`
      : "";

    const formattedTime = createdAt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return {
      id: doc.id,
      ...data,
      formattedDate,
      formattedTime,
    };
  });

  // Save last doc for next page
  const newStartAfter = snapshot.docs[snapshot.docs.length - 1];
  const newEndBefore = snapshot.docs[0];

  return { activities, startAfter: newStartAfter, endBefore: newEndBefore };
};

export {
  add_verify_post_activity,
  add_questionaire_submission_activity,
  add_create_client_file_activity,
  get_activities,
};
