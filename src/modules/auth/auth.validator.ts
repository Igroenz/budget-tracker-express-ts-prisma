import { string, z, ZodType } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});

export type UserDTO = z.infer<typeof userSchema>;

export const authRegisterSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.email(),
  password: z.string().min(4).max(255),
});

export type AuthRegisterDTO = z.infer<typeof authRegisterSchema>;

export const authLoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type AuthLoginDTO = z.infer<typeof authLoginSchema>;