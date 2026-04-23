"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getActionError, type ActionState } from "@/lib/action-error";

export async function createProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const supplierId = parseInt(formData.get("supplierId") as string, 10);
  const costPrice = parseFloat(formData.get("costPrice") as string);
  const retailPrice = parseFloat(formData.get("retailPrice") as string);
  const tradePrice = parseFloat(formData.get("tradePrice") as string);

  if (!name?.trim()) return { error: "Product name is required" };
  if (isNaN(supplierId)) return { error: "Please select a supplier" };
  if (isNaN(costPrice) || isNaN(retailPrice) || isNaN(tradePrice)) {
    return { error: "All prices must be valid numbers" };
  }

  try {
    await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        sku: sku?.trim() || null,
        supplierId,
        costPrice,
        retailPrice,
        tradePrice,
      },
    });
  } catch (e) {
    return getActionError(e);
  }

  // redirect() must be outside the try/catch — it throws internally to trigger navigation
  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}

// id is bound via .bind(null, id) in the page component
export async function updateProduct(id: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const supplierId = parseInt(formData.get("supplierId") as string, 10);
  const costPrice = parseFloat(formData.get("costPrice") as string);
  const retailPrice = parseFloat(formData.get("retailPrice") as string);
  const tradePrice = parseFloat(formData.get("tradePrice") as string);

  if (!name?.trim()) return { error: "Product name is required" };
  if (isNaN(supplierId)) return { error: "Please select a supplier" };
  if (isNaN(costPrice) || isNaN(retailPrice) || isNaN(tradePrice)) {
    return { error: "All prices must be valid numbers" };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        sku: sku?.trim() || null,
        supplierId,
        costPrice,
        retailPrice,
        tradePrice,
      },
    });
  } catch (e) {
    return getActionError(e);
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}
