// API route: DELETE /api/accounts/:id

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
    await prisma.account.delete({ where: { id } });
    revalidatePath("/accounts");
    revalidatePath("/dashboard");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/accounts] error:", err);
    return NextResponse.json(
      { error: "Could not delete account. It may already be deleted." },
      { status: 500 }
    );
  }
}
