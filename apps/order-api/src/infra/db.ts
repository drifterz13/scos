import { SQL } from "bun";
import { appConfig } from "../config/app-config";

const { dbUser, dbPassword, dbHost, dbPort, dbName } = appConfig;
const dbUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

export const sql = new SQL(dbUrl);
