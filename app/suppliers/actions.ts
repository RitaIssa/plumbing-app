"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getActionError, type ActionState } from "@/lib/action-error";

export async function createSupplier(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const website = formData.get("website") as string;

  if (!name?.trim()) return { error: "Supplier name is required" };

  try {
    await prisma.supplier.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        website: website?.trim() || null,
      },
    });
  } catch (e) {
    return getActionError(e);
  }

  // redirect() must be outside the try/catch — it throws internally to trigger navigation
  revalidatePath("/suppliers");
  revalidatePath("/dashboard");
  redirect("/suppliers");
}

// id is bound via .bind(null, id) in the page component
export async function updateSupplier(id: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const website = formData.get("website") as string;

  if (!name?.trim()) return { error: "Supplier name is required" };

  try {
    await prisma.supplier.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        website: website?.trim() || null,
      },
    });
  } catch (e) {
    return getActionError(e);
  }

  revalidatePath("/suppliers");
  revalidatePath("/dashboard");
  redirect("/suppliers");
}
