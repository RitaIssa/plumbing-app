"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActionError, type ActionState } from "@/lib/action-error";

export async function createPurchase(formData: FormData): Promise<ActionState> {
  const accountId = parseInt(formData.get("accountId") as string, 10);
  const productId = parseInt(formData.get("productId") as string, 10);
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const dateStr = formData.get("date") as string;
  const notes = formData.get("notes") as string;

  if (isNaN(accountId) || isNaN(productId)) return { error: "Invalid account or product." };
  if (isNaN(quantity) || quantity < 1) return { error: "Quantity must be at least 1." };

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { error: "Product not found." };
  if (product.stockQuantity < quantity) {
    return { error: `Only ${product.stockQuantity} unit${product.stockQuantity === 1 ? "" : "s"} in stock.` };
  }

  const date = dateStr ? new Date(dateStr) : new Date();

  try {
    await prisma.$transaction([
      prisma.purchase.create({
        data: {
          accountId,
          productId,
          quantity,
          date,
          notes: notes?.trim() || null,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: { decrement: quantity } },
      }),
    ]);
  } catch (e) {
    return getActionError(e);
  }

  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/products");
  revalidatePath("/dashboard");
  return null;
}
