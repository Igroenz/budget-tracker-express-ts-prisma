import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "./env.js";
import { PrismaClient } from "../generated/prisma/client.js";


const adapter = new PrismaMariaDb({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
});

const prisma = new PrismaClient({ adapter });

export { prisma };