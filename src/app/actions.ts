"use server";

import { revalidatePath } from "next/cache";

export async function revalidateUserProfile() {
  revalidatePath("/(protected)/[username]/(user)", "layout");
}
