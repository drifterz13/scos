import env from "env-var";

export const appConfig = {
  nodeEnv: env.get("NODE_ENV").default("development").asString(),
  port: env.get("PORT").default("3002").asPortNumber(),
  awsRegion: env.get("AWS_REGION").default("ap-southeast-1").asString(),
  dbHost: env.get("DB_HOST").default("localhost").asString(),
  dbPort: env.get("DB_PORT").default("5433").asPortNumber(),
  dbName: env.get("DB_NAME").required().asString(),
  dbUser: env.get("DB_USER").required().asString(),
  dbPassword: env.get("DB_PASSWORD").required().asString(),
  awsSQSEndpoint: env.get("AWS_SQS_ENDPOINT").default("http://localhost:4566").asString(),
  orderToWarehouseQueueUrl: env.get("ORDER_TO_WAREHOUSE_QUEUE_URL").required().asString(),
  orderServiceUrl: env.get("ORDER_SERVICE_URL").required().asString(),
};
