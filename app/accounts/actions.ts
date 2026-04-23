"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getActionError, type ActionState } from "@/lib/action-error";

export async function createAccount(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const type = formData.get("type") as "RETAIL" | "TRADE";

  if (!name?.trim()) return { error: "Account name is required" };

  try {
    await prisma.account.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        type: type === "TRADE" ? "TRADE" : "RETAIL",
      },
    });
  } catch (e) {
    return getActionError(e);
  }

  // redirect() must be outside the try/catch — it throws internally to trigger navigation
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  redirect("/accounts");
}

// id is bound via .bind(null, id) in the page component
export async function updateAccount(id: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const type = formData.get("type") as "RETAIL" | "TRADE";

  if (!name?.trim()) return { error: "Account name is required" };

  try {
    await prisma.account.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        type: type === "TRADE" ? "TRADE" : "RETAIL",
      },
    });
  } catch (e) {
    return getActionError(e);
  }

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  redirect("/accounts");
}
