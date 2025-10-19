import { serial, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const AIOutput = pgTable("aiOutput", {
  id: serial("id").primaryKey(),
  formData: varchar("formData", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  aiResponse: text("aiResponse"),
  createdBy: varchar("email", { length: 255 }).notNull(),
  createAt: varchar("createAt")
});

export const UserSubscription = pgTable("userSubscription", {
  id: serial("id").primaryKey(),
  email: varchar("email"),
  username: varchar("username"),
  active: boolean('active'),
  paymentId: varchar("paymentId"),
  joinDate: varchar("joinDate")
});