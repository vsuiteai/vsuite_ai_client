import { firestore_db } from "~/server/firebase/firebase-admin";
import { add_questionaire_submission_activity } from "./activityLogCont";

const add_form_submission = async (
  form_type: client_form_types,
  client_uid: string,
  answers: question_answer[]
) => {
  let collection = firestore_db.collection("onboarding_form_submission");

  const snapshot = await collection.add({
    client_uid: client_uid,
    answers: answers,
    form_type: form_type,
    created_at: new Date(),
  });

  add_questionaire_submission_activity(client_uid, snapshot.id, form_type);
  // console.log(snapshot.id);

  return snapshot.id;
};

const get_submissions = async ({ client_uid }: { client_uid: string }) => {
  let collection = firestore_db.collection("onboarding_form_submission");

  const snapshot = await collection.where("client_uid", "==", client_uid).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return { submissions: [] };
  }

  const submissions = snapshot.docs.map((doc) => {
    const data = doc.data();
    const createdAt = data.created_at?.toDate(); // Firestore Timestamp to JS Date

    // Format date like "Date: January 1, 2022"
    const formattedDate = createdAt
      ? `Date: ${createdAt.toLocaleDateString("en-US", {
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
  });

  return submissions;
};

const get_submissions_stat = async ({ client_uid }: { client_uid: string }) => {
  const submitted = {
    client_onboarding_form: false,
    advisior_onboarding_form: false,
  };

  let collection = firestore_db.collection("onboarding_form_submission");

  const snapshot = await collection.where("client_uid", "==", client_uid).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return submitted;
  }

  snapshot.docs.forEach((doc) => {
    const data = doc.data() as FirebaseFirestore.DocumentData &
      QuestionaireEntry;
    const createdAt = data.created_at?.toDate(); // Firestore Timestamp to JS Date

    if (data.form_type === "advisior_onboarding_form") {
      submitted.advisior_onboarding_form = true;
    }
    if (data.form_type === "client_onboarding_form") {
      submitted.client_onboarding_form = true;
    }
  });

  return submitted;
};

export { add_form_submission, get_submissions, get_submissions_stat };
