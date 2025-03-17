// import db from "./drizzle";
// import { Audiobook } from "./schema";

// export async function getAllUsers() {
//   return await db.select().from(User);
// }

// // Add a new user
// export async function addUser(name: string) {
//   return await db.insertInto(User).values({ name }).returning();
// }

// // Update a user
// export async function updateUser(id: number, name: string) {
//   return await db.update(User).set({ name }).where(User.id.equals(id));
// }

// // Delete a user
// export async function deleteUser(id: number) {
//   return await db.deleteFrom(User).where(User.id.equals(id));
// }