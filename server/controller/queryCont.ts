import { firestore_db } from "~/server/firebase/firebase-admin";
import axios from "axios";

const get_query_by_query_id = async (query_id: string) => {
  let collection = firestore_db.collection("query_data");

  const doc = await collection.doc(query_id).get();
  if (!doc.exists) {
    // console.log("No matching documents.");
    return null;
  }

  const data = doc.data();

  if (!data) {
    // console.log("No matching documents.");
    return null;
  }

  const createdAt = data.created_at?.toDate(); // Firestore Timestamp to JS Date

  // Format date like "Date: January 1, 2022"
  const formattedDate = createdAt
    ? `${createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`
    : "Date: Unknown";

  return {
    id: doc.id,
    ...data,
    formattedDate,
  };
};

const get_queries_by_client_uid = async (client_uid: string) => {
  let collection = firestore_db.collection("query_data");

  const snapshot = await collection
    .where("client.client_uid", "==", client_uid)
    .orderBy("created_at", "desc") // or "asc" for ascending
    .get();
  if (snapshot.empty) {
    // console.log("No matching documents.");
    return { queries: [] };
  }

  const queries = snapshot.docs.map((doc) => {
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

  return { queries: queries };
};

const getNumPages = (count: number | null, numPerPages: number): number => {
  if (!count) {
    return 0;
  }
  const numPages = Math.ceil(count / numPerPages);
  return numPages;
};

const get_queries_by_client_uid_with_pagination = async (
  client_uid: string,
  endBefore__doc_id__to_get_prev_data: string | null = null,
  startAfter__doc_id__to_get_next_data: string | null = null
) => {
  let collection = firestore_db.collection("query_data");

  let snapshot = collection.where("client.client_uid", "==", client_uid);

  let final_snapshot;
  let final_snapshot_count;

  if (endBefore__doc_id__to_get_prev_data) {
    const endBefore__doc_ref = await firestore_db
      .collection("query_data")
      .doc(endBefore__doc_id__to_get_prev_data)
      .get();
    final_snapshot = await snapshot
      .orderBy("created_at", "desc")
      .endBefore(endBefore__doc_ref)
      .limitToLast(10)
      .get();
  } else if (startAfter__doc_id__to_get_next_data) {
    // console.log("startAfter__doc_ref");
    const startAfter__doc_ref = await firestore_db
      .collection("query_data")
      .doc(startAfter__doc_id__to_get_next_data)
      .get();
    // console.log(startAfter__doc_ref.id);
    final_snapshot = await snapshot
      .orderBy("created_at", "desc")
      .startAfter(startAfter__doc_ref)
      .limit(10)
      .get();
  } else {
    final_snapshot = await snapshot
      .orderBy("created_at", "desc")
      .limit(10)
      .get();
  }

  if (final_snapshot.empty) {
    // console.log("No matching documents.");
    return {
      queries: [],
      pagination: {
        lastDoc: null,
        firstDoc: null,
        num_of_pages: 0,
      },
    };
  }

  final_snapshot_count = (await snapshot.count().get()).data().count ?? null;

  const queries = final_snapshot.docs.map((doc) => {
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

  return {
    queries: queries,
    pagination: {
      lastDoc: queries[queries.length - 1],
      firstDoc: queries[0],
      num_of_pages: getNumPages(final_snapshot_count, 10),
    },
  };
};

const get_queries_count_by_client_uid = async (client_uid: string) => {
  let collection = firestore_db.collection("query_data");

  const snapshot = await collection
    .where("client.client_uid", "==", client_uid)
    .get();

  if (snapshot.empty) {
    // console.log("No matching documents.");
    return 0;
  }

  return snapshot.size; // number of matching documents
};

const initiate_query_process = async (
  client_id: string,
  main_files: ClientUploadedFile[],
  ai_agent: ai_agentType
) => {
  const query_data = {
    client_id: client_id,
    ai_agent: ai_agent,
    files: main_files,
    execution_type: "execution_type",
  } as promp_request_body;
  try {
    await axios.post(
      "https://benjamin-strategy-group-analyzer-v2-658359490298.us-central1.run.app/process-all-at-once",
      query_data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("query sent");
  } catch (error: any) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    throw error;
  }
};

const get_all_queries_count = async (client_uid: string) => {
  let collection = firestore_db
    .collection("query_data")
    .where("client.client_uid", "==", client_uid);

  const snapshot = await collection.count().get();

  const count = snapshot.data().count;

  return count;
};

export {
  get_queries_by_client_uid,
  get_queries_count_by_client_uid,
  get_queries_by_client_uid_with_pagination,
  get_query_by_query_id,
  initiate_query_process,
  get_all_queries_count,
};
