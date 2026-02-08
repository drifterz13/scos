import { SQL } from "bun";
import { appConfig } from "../config/app-config";

const { dbUser, dbPassword, dbHost, dbPort, dbName, nodeEnv } = appConfig;
const sslMode = nodeEnv === "production" ? "require" : "disable";
const dbUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?sslmode=${sslMode}`;

export const sql = new SQL(dbUrl);
