import z from "zod";


const typeEnum = ["INCOME", "EXPENSE", "TRANSFER"] as const;

const transactionSchema = z.object({
  id: z.uuid(),
  user_id: z.string(),
  account_id: z.string(),
  category_id: z.coerce.number<number>(),
  amount: z.coerce.number<number>(),
  description: z.string().nullable(),
  transaction_date: z.iso.datetime(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().optional(),
});

export const createSchema = z.object({
  account_id: z.uuid("account tidak valid"),
  category_id: z.coerce.number<number>("categori tidak valid"),
  description: z.string().max(255).trim().nullish(),
  transaction_date: z.iso.datetime({ offset: true }),
  amount: z.string()
    .regex(/^\d{1,15}(\.\d{1,2})?$/, "Format nominal tidak valid")
    .refine((v) => Number(v) > 0, "Nominal harus lebih dari 0"),
});

export type TransactionCreateDTO = z.infer<typeof createSchema>;

export const getByIdSchema = z.object({
  id: z.string().min(1, "data tidak ditemukan"),
});

export type TransactionGetDTO = z.infer<typeof getByIdSchema>;

export const updateSchema = z.object({
  id: z.ulid("id transaksi tidak valid"),
  account_id: z.uuid("account tidak valid"),
  category_id: z.coerce.number<number>("categori tidak valid"),
  description: z.string().max(255).trim().nullish(),
  transaction_date: z.iso.datetime({ offset: true }),
  amount: z.string()
    .regex(/^\d{1,15}(\.\d{1,2})?$/, "Format nominal tidak valid")
    .refine((v) => Number(v) > 0, "Nominal harus lebih dari 0"),
});

export type TransactionUpdateDTO = z.infer<typeof updateSchema>;

export const removeSchema = z.object({
  id: z.string().min(1, "data tidak ditemukan"),
});

export type TransactionRemoveDTO = z.infer<typeof removeSchema>;

