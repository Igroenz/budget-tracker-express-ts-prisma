import z from "zod";
import { CategoryTypeEnum } from "../../generated/prisma/enums.js";

const categorySchema = z.object({
  id: z.coerce.number<number>().int(),
  name: z.string().min(2, "nama kategori harus diisi").max(100, "panjang karakter mulai dari 1 sampai 100"),
  type: z.enum(CategoryTypeEnum).default("EXPENSE"),
  icon: z.string().min(1, "pilih icon"),
  color: z.string().min(1, "pilih warna"),
  user_id: z.uuid(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const createSchema = categorySchema.pick({
  name: true,
  type: true,
  icon: true,
  color: true,
});

export type CategoryCreateDTO = z.infer<typeof createSchema>;

export const updateSchema = categorySchema.pick({
  id: true,
  name: true,
  type: true,
  icon: true,
  color: true,
});

export type CategoryUpdateDTO = z.infer<typeof updateSchema>;


export const categoryIdParams = categorySchema.pick({ id: true });

export type CategoryParamsId = z.infer<typeof categoryIdParams>;

export const categoryQuerySchema = categorySchema.pick({ type: true });

export type CategoryQueryDTO = z.infer<typeof categoryQuerySchema>;