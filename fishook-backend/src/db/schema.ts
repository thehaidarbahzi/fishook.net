import { mysqlTable, serial, varchar, json, datetime } from "drizzle-orm/mysql-core";

export const sessions = mysqlTable("sessions", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 255 }).notNull(),
  webhookId: varchar("webhook_id", { length: 255 }).notNull().unique(),
  createdAt: datetime("created_at").notNull(),
  expiresAt: datetime("expires_at").notNull(),
});

export const webhookLogs = mysqlTable("webhook_logs", {
  id: serial("id").primaryKey(),
  webhookId: varchar("webhook_id", { length: 255 }).notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  headers: json("headers"),
  queryParams: json("query_params"),
  body: json("body"),
  createdAt: datetime("created_at").notNull(),
});
