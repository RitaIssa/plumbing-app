// API route: DELETE /api/suppliers/:id
// Called by the DeleteButton component to remove a supplier.

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    // Deleting a supplier also deletes its products (cascade is set in the schema)
    await prisma.supplier.delete({ where: { id } });
    revalidatePath("/suppliers");
    revalidatePath("/products");
    revalidatePath("/dashboard");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete supplier. It may already be deleted." },
      { status: 500 }
    );
  }
}
