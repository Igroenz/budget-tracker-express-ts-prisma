import z from "zod";
import { AccountTypeEnum } from "../../generated/prisma/enums.js";

export const accountCreateSchema = z.object({
  name: z.string().min(1, "nama akun harus diisi").max(100, "nama akun tidak boleh lebih dari 100 karakter"),
  type: z.enum(AccountTypeEnum).default("CASH"),
  balance: z.coerce.number<number>().nonnegative(),
  currency: z.currencyCode(),
});

export type AccountCreateDTO = z.infer<typeof accountCreateSchema>;

export const accountQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(80).default(10),
  name: z.string().optional(),
  type: z.string().optional(),
});

export type AccountQueryDTO = z.infer<typeof accountQuerySchema>;

export const accountParamSchema = z.object({
  id: z.string().trim(),
});

export type AccountParamsDTO = z.infer<typeof accountParamSchema>;

export const accountUpdateSchema = z.object({
  id: z.string().min(1, "id akun tidak ditemukan"),
  name: z.string().min(1, "nama akun harus diisi").max(100, "nama akun tidak boleh lebih dari 100 karakter"),
  type: z.enum(AccountTypeEnum).default("CASH"),
  balance: z.coerce.number<number>().nonnegative(),
  currency: z.currencyCode(),
});

export type AccountUpdateDTO = z.infer<typeof accountUpdateSchema>;
