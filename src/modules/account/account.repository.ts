import { prisma } from "../../config/db.js";
import type { AccountWhereInput } from "../../generated/prisma/models.js";
import type { AccountCreateDTO, AccountUpdateDTO } from "./account.validator.js";

export class AccountRepository {
  async checkAccount(userId: string, name: string) {
    return prisma.account.count({
      where: {
        user_id: userId,
        name: name,
      }
    }) 
  }

  async create(userId: string, data: AccountCreateDTO) {
    return prisma.account.create({
      data: {
        user_id: userId,
        name: data.name,
        type: data.type,
        balance: data.balance,
        currency: data.currency,
      }
    }) 
  };

  async update(data: AccountUpdateDTO) {
    return prisma.account.update({
      where: { id: data.id },
      data: {
        name: data.name,
        type: data.type,
        balance: data.balance,
        currency: data.currency,
      }
    })
  };

  async search(filters: Record<string, string | number | null>[], skip: number, size: number) {
    return prisma.$transaction([
      prisma.account.findMany({
        where: { AND: filters },
        take: size,
        skip: skip,
      }),
      prisma.account.count({
        where: { AND: filters }
      }),
    ]);
  };

  async getById(id: string) {
    return prisma.account.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
      },
    });
  };

  async remove(accountId: string) {
    const dateNow = new Date();
    return prisma.account.update({
      where: { id: accountId },
      data: {
        deleted_at: dateNow,
      }
    })
  }
}