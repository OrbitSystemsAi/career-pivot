import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL is required.");

const sql = neon(url);
const migrationUrl = new URL("../database/migrations/001_durable_accounts_and_posts.sql", import.meta.url);
const statements = (await readFile(migrationUrl, "utf8"))
  .split("-- statement-breakpoint")
  .map((statement) => statement.trim())
  .filter(Boolean);
for (const statement of statements) await sql.query(statement);
console.log("Career Pivot database migration applied.");
