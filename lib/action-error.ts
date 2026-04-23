import { Prisma } from "@prisma/client";

// Shared type returned by all form server actions — null means no error.
// field is set when the error belongs to a specific input (so the form can render it inline).
export type ActionState = { error: string; field?: string } | null;

// Converts a Prisma (or unknown) error into an ActionState ready to return from a server action.
export function getActionError(error: unknown): ActionState {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const target = error.meta?.target;
    const fields = Array.isArray(target) ? target.join(",") : String(target ?? "");
    if (fields.includes("sku")) return { error: "This SKU is already in use. Please choose a different one.", field: "sku" };
    if (fields.includes("email")) return { error: "An account with this email already exists.", field: "email" };
    return { error: "This value is already in use. Please try a different one." };
  }
  return { error: "Something went wrong. Please try again." };
}
