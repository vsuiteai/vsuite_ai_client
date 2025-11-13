import "dotenv/config";

import { Sequelize } from "sequelize";

// Import models
import { AdminModel } from "./admins";
import { ConsultantModel } from "./consultants";
import { ClientModel } from "./clients";
import { ClientFilesUploadModel } from "./client_files_upload";
import { ClientVerificationModel } from "./client_verification";
import { PromptStatsModel } from "./prompt_stats";

const MYSQL = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

// Initialize Sequelize
export const sequelize = new Sequelize(
  MYSQL.database!,
  MYSQL.user!,
  MYSQL.password!,
  {
    host: MYSQL.host!,
    dialect: "mysql",
    logging: false,
  }
);

// Define models
export const Admins = AdminModel(sequelize);
export const Consultants = ConsultantModel(sequelize);
export const Clients = ClientModel(sequelize);
export const ClientFiles = ClientFilesUploadModel(sequelize);
export const ClientVerification = ClientVerificationModel(sequelize);
export const PromptStats = PromptStatsModel(sequelize);

ClientFiles.belongsTo(Clients, {
  foreignKey: "file_owner",
  as: "owner",
});

PromptStats.belongsTo(Clients, {
  foreignKey: "client_id",
  as: "owner",
});

ClientVerification.belongsTo(Clients, {
  foreignKey: "cl_ver_client_id",
  as: "client_to_be_verified",
});

export default {
  sequelize,
  Admins,
  Consultants,
  Clients,
  ClientFiles,
  ClientVerification,
};
