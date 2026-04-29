"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getActionError, type ActionState } from "@/lib/action-error";

function optFloat(formData: FormData, key: string): number | null {
  const raw = (formData.get(key) as string)?.trim();
  if (!raw) return null;
  const val = parseFloat(raw);
  return isNaN(val) ? null : val;
}

export async function createProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const supplierId = parseInt(formData.get("supplierId") as string, 10);
  const costPrice = parseFloat(formData.get("costPrice") as string);
  const retailPrice = parseFloat(formData.get("retailPrice") as string);
  const tradePrice = parseFloat(formData.get("tradePrice") as string);
  const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10);
  const width = optFloat(formData, "width");
  const height = optFloat(formData, "height");
  const depth = optFloat(formData, "depth");
  const weight = optFloat(formData, "weight");

  if (!name?.trim()) return { error: "Product name is required" };
  if (isNaN(supplierId)) return { error: "Please select a supplier" };
  if (isNaN(costPrice) || isNaN(retailPrice) || isNaN(tradePrice)) {
    return { error: "All prices must be valid numbers" };
  }
  if (isNaN(stockQuantity) || stockQuantity < 0) {
    return { error: "Stock quantity must be 0 or more" };
  }

  try {
    await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        sku: sku?.trim() || null,
        category: category?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        supplierId,
        costPrice,
        retailPrice,
        tradePrice,
        stockQuantity,
        width,
        height,
        depth,
        weight,
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

// Adds stock to a product without replacing it — called from the RestockModal.
export async function restockProduct(id: number, addQty: number): Promise<ActionState> {
  if (!Number.isInteger(addQty) || addQty < 1) {
    return { error: "Please enter a valid quantity (minimum 1)." };
  }
  try {
    await prisma.product.update({
      where: { id },
      data: { stockQuantity: { increment: addQty } },
    });
  } catch (e) {
    return getActionError(e);
  }
  revalidatePath("/products");
  revalidatePath("/dashboard");
  return null;
}

// id is bound via .bind(null, id) in the page component
export async function updateProduct(id: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const supplierId = parseInt(formData.get("supplierId") as string, 10);
  const costPrice = parseFloat(formData.get("costPrice") as string);
  const retailPrice = parseFloat(formData.get("retailPrice") as string);
  const tradePrice = parseFloat(formData.get("tradePrice") as string);
  const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10);
  const width = optFloat(formData, "width");
  const height = optFloat(formData, "height");
  const depth = optFloat(formData, "depth");
  const weight = optFloat(formData, "weight");

  if (!name?.trim()) return { error: "Product name is required" };
  if (isNaN(supplierId)) return { error: "Please select a supplier" };
  if (isNaN(costPrice) || isNaN(retailPrice) || isNaN(tradePrice)) {
    return { error: "All prices must be valid numbers" };
  }
  if (isNaN(stockQuantity) || stockQuantity < 0) {
    return { error: "Stock quantity must be 0 or more" };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        sku: sku?.trim() || null,
        category: category?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        supplierId,
        costPrice,
        retailPrice,
        tradePrice,
        stockQuantity,
        width,
        height,
        depth,
        weight,
      },
    });
  } catch (e) {
    return getActionError(e);
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}
