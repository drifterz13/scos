import { SQL } from "bun";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = Bun.env;
const dbUrl = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require`;

const sql = new SQL(dbUrl);

const data = [
  {
    name: "Los Angeles",
    latitude: 33.9425,
    longitude: -118.408056,
    stock_quantity: 355,
  },
  {
    name: "New York",
    latitude: 40.639722,
    longitude: -73.778889,
    stock_quantity: 578,
  },
  {
    name: "São Paulo",
    latitude: -23.435556,
    longitude: -46.473056,
    stock_quantity: 265,
  },
  {
    name: "Paris",
    latitude: 49.009722,
    longitude: 2.547778,
    stock_quantity: 694,
  },
  {
    name: "Warsaw",
    latitude: 52.165833,
    longitude: 20.967222,
    stock_quantity: 245,
  },
  {
    name: "Hong Kong",
    latitude: 22.308889,
    longitude: 113.914444,
    stock_quantity: 419,
  },
];

await sql.transaction(async (tx) => {
  await tx`TRUNCATE TABLE warehouses RESTART IDENTITY;`;
  await tx`INSERT INTO warehouses ${sql(data)}`;
});

console.log("Database seeded successfully.");
