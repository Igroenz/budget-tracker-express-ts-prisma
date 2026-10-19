import { afterEach, beforeEach, describe, expect, it } from "vitest";
import supertest from "supertest";
import app from "../../src/application/app";
import { logger } from "../../src/config/logging";
import { randomUUID } from "crypto";
import { createAccountForTransfer, createTestUserForTransfer, getTestAccountForTransfer, removeTestUserForTransfer, removeTransfer } from "../utils";

describe('POST /transfer', () => {
  beforeEach(async () => {
    await createTestUserForTransfer();
    await createAccountForTransfer();
  })

  afterEach(async () => {
    await removeTransfer()
    await removeTestUserForTransfer()
  });

  it('should can create transfer', async () => {
    const account = await getTestAccountForTransfer();
    const sourceAccount = account[0];
    const destAccount = account[1];
    const result = await supertest(app)
      .post("/api/v1/transfer")
      .set("Authorization", "Bearer transfertest")
      .send({
        source_account_id: sourceAccount.id,
        dest_account_id: destAccount.id,
        amount: "700.00",
        description: "test tranfers",
        transaction_date: new Date(),
      });
    
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Transfer created successfully");
    expect(result.body.data.transfer.source_account.balance).toBe("300");
    expect(result.body.data.transfer.dest_account.balance).toBe("2700");
  });

  it('should error if request source_account_id/dest_account_id not match or invalid', async () => {
    const result = await supertest(app)
      .post("/api/v1/transfer")
      .set("Authorization", "Bearer transfertest")
      .send({
        source_account_id: randomUUID(),
        dest_account_id: randomUUID(),
        amount: "700.00",
        description: "test tranfers",
        transaction_date: new Date(),
      });
    
const result1 = await supertest(app)
      .post("/api/v1/transfer")
      .set("Authorization", "Bearer transfertest")
      .send({
        source_account_id: "salah",
        dest_account_id: "",
        amount: "700.00",
        description: "test tranfers",
        transaction_date: new Date(),
      });
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Account not found");
    expect(result1.status).toBe(422);
    expect(result1.body.success).toBe(false);
    expect(result1.body.message).toBe("Validasi gagal");
    expect(result1.body.errors).toBeDefined();
  });

  it('should error if request amount greater than balance', async () => {
    const account = await getTestAccountForTransfer();
    const sourceAccount = account[0];
    const destAccount = account[1];
    const result = await supertest(app)
      .post("/api/v1/transfer")
      .set("Authorization", "Bearer transfertest")
      .send({
        source_account_id: sourceAccount.id,
        dest_account_id: destAccount.id,
        amount: "1100.00",
        description: "test tranfers",
        transaction_date: new Date(),
      });
    
    expect(result.status).toBe(422);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Insufficient balance for this transaction");
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /transaction/{id}', () => {
  beforeEach(async () => {
    await createTestUserForTransfer();
    await createAccountForTransfer();
  })

  afterEach(async () => {
    await removeTransfer()
    await removeTestUserForTransfer()
  });

  it('should error 404 if params invalid', async () => {
    const result = await supertest(app)
      .get(`/api/v1/transfer/salah`)
      .set("Authorization", "Bearer transfertest")
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data not found");
  });

  it('should can get detail transaction', async () => {
    const account = await getTestAccountForTransfer();
    const sourceAccount = account[0];
    const destAccount = account[1];
    const createTransfer = await supertest(app)
      .post("/api/v1/transfer")
      .set("Authorization", "Bearer transfertest")
      .send({
        source_account_id: sourceAccount.id,
        dest_account_id: destAccount.id,
        amount: "700.00",
        description: "test tranfers",
        transaction_date: new Date(),
      });

    const tfId = createTransfer.body.data.transfer.id;

    const result = await supertest(app)
      .get(`/api/v1/transfer/${tfId}`)
      .set("Authorization", "Bearer transfertest");
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Detail transfer retrieved successfully");
    expect(result.body.data).toBeDefined();
    expect(result.body.data.id).toBe(tfId);
    expect(result.body.data.source_account.balance).toBe("300");
    expect(result.body.data.dest_account.balance).toBe("2700");
  });

});

// describe('PUT /transaction/{id}', () => {
//   beforeEach(async () => {
//     await createTestUserForTransaction();
//     await createAccountForTransaction();
//     await createCategoryForTransaction();
//   })

//   afterEach(async () => {
//     await removeTransaction()
//     await removeTestUserForTransaction()
//   });

//   it('should can update transaction and increase balance', async () => {
//     const [account, category] = await getDataForTransaction();
//     const createTrx = await supertest(app)
//       .post("/api/v1/transaction")
//       .set("Authorization", "Bearer transactiontest")
//       .send({
//         account_id: account?.id,
//         category_id: category?.id,
//         amount: "2000.00",
//         description: "test transaction",
//         transaction_date: new Date(),
//       })

//     const result = await supertest(app)
//       .put(`/api/v1/transaction/${createTrx.body.data.transaction.id}`)
//       .set("Authorization", "Bearer transactiontest")
//       .send({
//         id: createTrx.body.data.transaction.id,
//         account_id: account?.id,
//         category_id: category?.id,
//         amount: "1000.00",
//         description: "test transaction",
//         transaction_date: new Date(),
//       })
    
//     expect(result.status).toBe(200);
//     expect(result.body.success).toBe(true);
//     expect(result.body.message).toBe("Transaction updated successfully");
//     expect(result.body.data.transaction.account.balance).toBe("9000");
//   });

//   it('should can update transaction and decrease balance', async () => {
//     const [account, category] = await getDataForTransaction();
//     const createTrx = await supertest(app)
//       .post("/api/v1/transaction")
//       .set("Authorization", "Bearer transactiontest")
//       .send({
//         account_id: account?.id,
//         category_id: category?.id,
//         amount: "2000.00",
//         description: "test transaction",
//         transaction_date: new Date(),
//       })

//     const result = await supertest(app)
//       .put(`/api/v1/transaction/${createTrx.body.data.transaction.id}`)
//       .set("Authorization", "Bearer transactiontest")
//       .send({
//         id: createTrx.body.data.transaction.id,
//         account_id: account?.id,
//         category_id: category?.id,
//         amount: "5000.00",
//         description: "test transaction",
//         transaction_date: new Date(),
//       })
    
//     logger.debug(result.body)
    
//     expect(result.status).toBe(200);
//     expect(result.body.success).toBe(true);
//     expect(result.body.message).toBe("Transaction updated successfully");
//     expect(result.body.data.transaction.account.balance).toBe("5000");
//   });

//   it('should error if amount greater then balance', async () => {
//     const [account, category] = await getDataForTransaction();
//     const createTrx = await supertest(app)
//       .post("/api/v1/transaction")
//       .set("Authorization", "Bearer transactiontest")
//       .send({
//         account_id: account?.id,
//         category_id: category?.id,
//         amount: "5000.00",
//         description: "test transaction",
//         transaction_date: new Date(),
//       })

//     const result = await supertest(app)
//       .put(`/api/v1/transaction/${createTrx.body.data.transaction.id}`)
//       .set("Authorization", "Bearer transactiontest")
//       .send({
//         id: createTrx.body.data.transaction.id,
//         account_id: account?.id,
//         category_id: category?.id,
//         amount: "10500.00",
//         description: "test transaction",
//         transaction_date: new Date(),
//       })
    
//     logger.debug(result.body)
    
//     expect(result.status).toBe(422);
//     expect(result.body.success).toBe(false);
//     expect(result.body.message).toBe("Insufficient balance for this transaction");
//     expect(result.body.errors).toBeDefined();
//   });
  
//   it('should error if data invalid', async () => {
//     const [account, category] = await getDataForTransaction();
//     const createTrx = await supertest(app)
//       .post("/api/v1/transaction")
//       .set("Authorization", "Bearer transactiontest")
//       .send({
//         account_id: account?.id,
//         category_id: category?.id,
//         amount: "5000.00",
//         description: "test transaction",
//         transaction_date: new Date(),
//       })

//     const result = await supertest(app)
//       .put(`/api/v1/transaction/${createTrx.body.data.transaction.id}`)
//       .set("Authorization", "Bearer transactiontest")
//       .send({
//         id: createTrx.body.data.transaction.id,
//         account_id: randomUUID(),
//         category_id: category?.id,
//         amount: "10500.00",
//         description: "test transaction",
//         transaction_date: new Date(),
//       })
    
//     logger.debug(result.body)
    
//     expect(result.status).toBe(404);
//     expect(result.body.success).toBe(false);
//     expect(result.body.message).toBe("Transaction not found");
//   });
// });

describe('DELETE /accounts/{id}', () => {
  beforeEach(async () => {
    await createTestUserForTransfer();
    await createAccountForTransfer();
  })

  afterEach(async () => {
    await removeTransfer()
    await removeTestUserForTransfer()
  });
  
  it('should can delete transaction', async () => {
    const account = await getTestAccountForTransfer();
    const sourceAccount = account[0];
    const destAccount = account[1];
    const createTransfer = await supertest(app)
      .post("/api/v1/transfer")
      .set("Authorization", "Bearer transfertest")
      .send({
        source_account_id: sourceAccount.id,
        dest_account_id: destAccount.id,
        amount: "700.00",
        description: "test tranfers",
        transaction_date: new Date(),
      });

    const tfId = createTransfer.body.data.transfer.id;
    
    const result = await supertest(app)
      .delete(`/api/v1/transfer/${tfId}`)
      .set("Authorization", "Bearer transfertest");

    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Transfer deleted successfully");
    expect(createTransfer.body.data.deleted_at).toBeFalsy();
    expect(result.body.data.deleted_at).toBeDefined();

  });

  it('should error 404 if params invalid', async () => {
    const result = await supertest(app)
      .delete(`/api/v1/transaction/salah`)
      .set("Authorization", "Bearer transfertest")
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data not found");
  });
})