import { prisma } from "../../config/db.js";
import { Prisma, type Transfer } from "../../generated/prisma/client.js";
import { InsufficientBalanceError, NotFoundError } from "../../helpers/app-error.js";
import type { TransferCreateDTO, TransferDTO } from "./transfer.validator.js";

export class TransferRepository {
  async create(user_id: string, data: TransferCreateDTO) {
    const amount = new Prisma.Decimal(data.amount);
    const accountIds = [data.source_account_id, data.dest_account_id].sort();
    return prisma.$transaction(async (tx) => {
      const accounts = await tx.$queryRaw<Array<{
        id: string,
        user_id: string,
        balance: string,
        currency: string
      }>>`
      SELECT id, user_id, balance, currency
      FROM accounts
      WHERE id IN (${Prisma.join(accountIds)})
      FOR UPDATE`;

      const source_account = accounts.find((account) => account.id === data.source_account_id);
      const dest_account = accounts.find((account) => account.id === data.dest_account_id);
      
      if (!source_account || !dest_account) throw new NotFoundError("Account not found");
      
      if (source_account.user_id !== user_id || dest_account.user_id !== user_id) throw new NotFoundError("Account not found");

      const source_balance = new Prisma.Decimal(source_account.balance);

      if (source_balance.lt(amount)) {
        throw new InsufficientBalanceError("Insufficient balance for this transaction", {
          current_balance: source_balance.toString(),
          transfer_amount: amount.toString(),
        });
      };

      await tx.account.update({
        where: {
          user_id: user_id,
          id: source_account.id,
        },
        data: {
          balance: { decrement: amount },
        },
      });

      await tx.account.update({
        where: {
          user_id: user_id,
          id: dest_account.id,
        },
        data: {
          balance: { increment: amount }
        },
      });

      const tf = await tx.transfer.create({
        data: {
          user_id: user_id,
          source_account_id: source_account.id,
          dest_account_id: dest_account.id,
          amount: amount,
          description: data.description ?? null,
          transaction_date: data.transaction_date
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          source_account: { select: { id: true, name: true, balance: true, currency: true } },
          dest_account: { select: { id: true, name: true, balance: true, currency: true } },
          
        }
      })
      
      return { transfer: tf };
    })
  };

  async findById(id: string) {
    return prisma.transfer.findUnique({
      where: { id: id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        source_account: { select: { id: true, name: true, balance: true, currency: true } },
        dest_account: { select: { id: true, name: true, balance: true, currency: true } },
      }
    })
  };

  async remove(trfId: string) {
    const now = new Date();
    return prisma.transfer.update({
      where: {
        id: trfId,
      },
      data: {
        deleted_at: now,
      },
    })
  }
}