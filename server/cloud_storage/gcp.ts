import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: "shining-sol-453718-d6",
  keyFilename:
    "/Users/mac/Projects/Marcus Ben/webapp_v2/main_website_client/credentials/cred_firebase.json",
});

const bucketName = "client-metrics-assets";
const bucket = storage.bucket(bucketName);

export { storage, bucket, bucketName };
