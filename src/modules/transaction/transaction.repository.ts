import { prisma } from "../../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError, InsufficientBalanceError, NotFoundError } from "../../helpers/app-error.js";
import type { TransactionCreateDTO, TransactionUpdateDTO } from "./transaction.validator.js";

export class TransactionRepository {
  async create(user_id: string, data: TransactionCreateDTO) {
    const amount = new Prisma.Decimal(data.amount);
    return prisma.$transaction(async (tx) => {
      const { count } = await tx.account.updateMany({
        where: {
          id: data.account_id,
          user_id: user_id,
          balance: { gt: amount },
        },
        data: {
          balance: { decrement: amount }
        }
      });

      if (count === 0) {
        const account = await tx.account.findFirst({
          where: { id: data.account_id, user_id: user_id },
          select: { balance: true, currency: true },
        });
        if (!account) throw new NotFoundError("Account not found");
        throw new InsufficientBalanceError("Insufficient balance for this transaction", {
          current_balance: account.balance.toString(),
          transaction_amount: amount.toString(),
          currency: account.currency,
        });
      }

      // const check = await tx.$queryRaw<{id: string, balance: number, user_id: string}[]>
      //   `SELECT id, balance, user_id 
      //   FROM accounts
      //   WHERE id =${data.account_id} AND 
      //   user_id=${user_id} AND 
      //   balance > ${amount}
      //   FOR UPDATE`;

      const transaction = await tx.transaction.create({
        data: {
          user_id: user_id,
          account_id: data.account_id,
          category_id: data.category_id!,
          amount,
          description: data.description ?? null,
          transaction_date: data.transaction_date,
        },
        include: {
          account: { select: { id: true, balance: true, currency: true } },
          category: { select: { id: true, name: true, type: true} },
          user: {select: { id: true, name: true, email: true}},
        }
      });


      return { transaction };
    })
  };

  async findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id: id },
      include: {
        account: { select: { name: true, balance: true, currency: true, type: true } },
        category: { select: { id: true, name: true, type: true, icon: true, color: true } },
        user: {select: { id: true, name: true, email: true}},
      }
    })
  };

  async update(user_id: string, data: TransactionUpdateDTO) {
    return prisma.$transaction(async (tx) => {
      const trxRows = await tx.$queryRaw<Array<{
        id: string,
        user_id: string,
        account_id: string,
        amount: string,
      }>>`
      SELECT id, user_id, account_id, amount
      FROM transactions
      WHERE id = ${data.id}
        AND user_id = ${user_id}
        AND account_id = ${data.account_id}
      FOR UPDATE`;
      
      const trx = trxRows[0];
      if (!trx) throw new NotFoundError("Transaction not found");

      const oldAmount = new Prisma.Decimal(trx.amount);
      const newAmount = new Prisma.Decimal(data.amount);

      const diffAmount = newAmount.sub(oldAmount);
      
      const accountRows = await tx.$queryRaw<Array<{
        id: string,
        user_id: string,
        balance: string,
        currency: string
      }>>`
      SELECT id, user_id, balance, currency
      FROM accounts
      WHERE id = ${trx.account_id}
        AND user_id = ${trx.user_id}
      FOR UPDATE`;
      
      const account = accountRows[0];
      if (!account) throw new NotFoundError("Account not found");

      const currentBalance = new Prisma.Decimal(account.balance);

      if (diffAmount.gt(0) && currentBalance.lt(diffAmount)) {
        const available = currentBalance.add(oldAmount);
        throw new InsufficientBalanceError("Insufficient balance for this transaction", {
          current_balance: available.toString(),
          transaction_amount: newAmount.toString(),
          currency: account.currency,
        });
      }

      const updateAccount = await tx.account.update({
        where: {
          id: trx.account_id,
        },
        data: {
          balance: {decrement: diffAmount},
        }
      });


      const transaction = await tx.transaction.update({
        where: {
          id: data.id,
          user_id: user_id,
        },
        data: {
          user_id: user_id,
          account_id: data.account_id,
          category_id: data.category_id,
          amount: newAmount,
          description: data.description ?? null,
          transaction_date: data.transaction_date,
        },
        include: {
          account: { select: { id: true, name: true, balance: true, currency: true } },
          category: { select: { id: true, name: true, type: true} },
          user: {select: { id: true, name: true, email: true}},
        }
      });

      return { transaction };
    })
  };

  async remove(trxId: string) {
    const now = new Date();
    return prisma.transaction.update({
      where: {
        id: trxId,
      },
      data: {
        deleted_at: now,
      },
    })
  }
}