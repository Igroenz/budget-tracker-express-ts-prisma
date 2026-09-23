import type { UserDTO } from "../modules/auth/auth.validator.js";
import { UnauthorizedError } from "./app-error.js"

export const ValidatorDataUnknown = <T>(
  data: unknown,
  validator: (data:unknown) => data is T
): T => {
  if (validator(data)) {
    return data
  }

  throw new UnauthorizedError("Data tidak valid");
}

export const isUser = (data: unknown): data is UserDTO => {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "email" in data
  )
};