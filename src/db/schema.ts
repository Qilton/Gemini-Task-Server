
import { uuid, pgTable, varchar, timestamp, index,integer,boolean } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id").notNull().unique(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
 profileImageUrl: varchar("profile_image_url", { length: 512 }), 
  createdAt: timestamp("created_at", { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
     clerkIdx: index("clerk_idx").on(table.clerkId),
    emailIdx: index("email_idx").on(table.email),
    usernameIdx: index("username_idx").on(table.username),
  })
);

export const taskTable = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  xp: integer("xp").notNull().default(0),  
  completed: boolean("completed").notNull().default(false),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }), 
  createdAt: timestamp("created_at", { 
    mode: "date", 
    precision: 3,
  }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { 
    mode: "date", 
    precision: 3,
  }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  userIdx: index("task_user_idx").on(table.userId), 
  completedIdx: index("task_completed_idx").on(table.completed)  
}));
