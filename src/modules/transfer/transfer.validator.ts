import z from "zod";

export const transferSchema = z.object({
  id: z.ulid(),
  user_id: z.uuid(),
  source_account_id: z.uuid(),
  dest_account_id: z.uuid(),
  amount: z.string(),
  description: z.string().nullish(),
  transaction_date: z.iso.datetime({ offset: true }),
  created_at: z.iso.datetime({ offset: true }),
  updated_at: z.iso.datetime({ offset: true }).nullish(),
  deleted_at: z.iso.datetime({ offset: true }).nullish(),
});

export type TransferDTO = z.infer<typeof transferSchema>;

export const createSchema = z.object({
  source_account_id: z.uuid("account tidak valid"),
  dest_account_id: z.uuid("account tidak valid"),
  description: z.string().max(255).trim().nullish(),
  transaction_date: z.iso.datetime({ offset: true }),
  amount: z.string()
    .regex(/^\d{1,15}(\.\d{1,2})?$/, "Format nominal tidak valid")
    .refine((v) => Number(v) > 0, "Nominal harus lebih dari 0"),
});

export type TransferCreateDTO = z.infer<typeof createSchema>;

export const paramsSchema = z.object({
  id: z.string().min(1, "data tidak ditemukan"),
});

export type TransferIdDTO = z.infer<typeof paramsSchema>;
