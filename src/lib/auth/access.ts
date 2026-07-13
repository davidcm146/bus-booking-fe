import type { OperatorUser, User } from "@/types/auth";

export function isOperatorUser(user: User | null): user is OperatorUser {
  return user?.role === "operator" && typeof user.operatorId === "string";
}
