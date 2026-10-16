import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createAccountForTransaction, createCategoryForTransaction, createTestAccount, createTestUserForAccount, createTestUserForTransaction, getDataForTransaction, getTestAccountForAccount, removeTestUserForAccount, removeTestUserForTransaction, removeTransaction } from "../utils";
import supertest from "supertest";
import app from "../../src/application/app";
import { logger } from "../../src/config/logging";
import { randomUUID } from "crypto";

describe('POST /transaction', () => {
  beforeEach(async () => {
    await createTestUserForTransaction();
    await createAccountForTransaction();
    await createCategoryForTransaction();
  })

  afterEach(async () => {
    await removeTransaction()
    await removeTestUserForTransaction()
  });

  it('should can create transaction', async () => {
    const [account, category] = await getDataForTransaction();
    const result = await supertest(app)
      .post("/api/v1/transaction")
      .set("Authorization", "Bearer transactiontest")
      .send({
        account_id: account?.id,
        category_id: category?.id,
        amount: "5000.00",
        description: "test transaction",
        transaction_date: new Date(),
      })
    
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Transaction created successfully");
  });

  it('should error if request account_id not match or invalid', async () => {
    const [account, category] = await getDataForTransaction();
    const result = await supertest(app)
      .post("/api/v1/transaction")
      .set("Authorization", "Bearer transactiontest")
      .send({
        account_id: randomUUID(),
        category_id: category?.id,
        amount: "5000.00",
        description: "test transaction",
        transaction_date: new Date(),
      });
    
    const result1 = await supertest(app)
      .post("/api/v1/transaction")
      .set("Authorization", "Bearer transactiontest")
      .send({
        account_id: "salah",
        category_id: category?.id,
        amount: "1000.00",
        description: "test transaction",
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

  // it('should reject if request type invalid', async () => {
  //   const result = await supertest(app)
  //     .post("/api/v1/accounts")
  //     .set("Authorization", "Bearer accounttest")
  //     .send({
  //       name: "BCA",
  //       type: "BANG",
  //       balance: 1000000,
  //       currency: "IDR",
  //     });
    
  //   expect(result.status).toBe(422);
  //   expect(result.body.success).toBe(false);
  //   expect(result.body.message).toBe("Validasi gagal");
  //   expect(result.body.errors).toBeDefined();
  // });

  // it('should can create account', async () => {
  //   const result = await supertest(app)
  //     .post("/api/v1/accounts")
  //     .set("Authorization", "Bearer accounttest")
  //     .send({
  //       name: "Bank BCA",
  //       type: "BANK",
  //       balance: 1000000,
  //       currency: "IDR",
  //     });
    
  //   expect(result.status).toBe(201);
  //   expect(result.body.success).toBe(true);
  //   expect(result.body.message).toBe("Account created successfully");
  //   expect(result.body.data.name).toBe("Bank BCA");
  // });
});

describe('GET /transaction/{id}', () => {
  beforeEach(async () => {
    await createTestUserForTransaction();
    await createAccountForTransaction();
    await createCategoryForTransaction();
  })

  afterEach(async () => {
    await removeTransaction()
    await removeTestUserForTransaction()
  });

  it('should error 404 if params invalid', async () => {
    const result = await supertest(app)
      .get(`/api/v1/transaction/salah`)
      .set("Authorization", "Bearer transactiontest")
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data not found");
  });

  it('should can get detail transaction', async () => {
    const [account, category] = await getDataForTransaction();
    const createTrx = await supertest(app)
      .post("/api/v1/transaction")
      .set("Authorization", "Bearer transactiontest")
      .send({
        account_id: account?.id,
        category_id: category?.id,
        amount: "2000.00",
        description: "test transaction",
        transaction_date: new Date(),
      })

    const trxId = createTrx.body.data.transaction.id;

    const result = await supertest(app)
      .get(`/api/v1/transaction/${trxId}`)
      .set("Authorization", "Bearer transactiontest");
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Detail transaction retrieved successfully");
    expect(result.body.data).toBeDefined();
    expect(result.body.data.id).toBe(trxId);

  });
});

describe('PUT /transaction/{id}', () => {
  beforeEach(async () => {
    await createTestUserForTransaction();
    await createAccountForTransaction();
    await createCategoryForTransaction();
  })

  afterEach(async () => {
    await removeTransaction()
    await removeTestUserForTransaction()
  });

  it('should can update transaction and increase balance', async () => {
    const [account, category] = await getDataForTransaction();
    const createTrx = await supertest(app)
      .post("/api/v1/transaction")
      .set("Authorization", "Bearer transactiontest")
      .send({
        account_id: account?.id,
        category_id: category?.id,
        amount: "2000.00",
        description: "test transaction",
        transaction_date: new Date(),
      })

    const result = await supertest(app)
      .put(`/api/v1/transaction/${createTrx.body.data.transaction.id}`)
      .set("Authorization", "Bearer transactiontest")
      .send({
        id: createTrx.body.data.transaction.id,
        account_id: account?.id,
        category_id: category?.id,
        amount: "1000.00",
        description: "test transaction",
        transaction_date: new Date(),
      })
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Transaction updated successfully");
    expect(result.body.data.transaction.account.balance).toBe("9000");
  });

  it('should can update transaction and decrease balance', async () => {
    const [account, category] = await getDataForTransaction();
    const createTrx = await supertest(app)
      .post("/api/v1/transaction")
      .set("Authorization", "Bearer transactiontest")
      .send({
        account_id: account?.id,
        category_id: category?.id,
        amount: "2000.00",
        description: "test transaction",
        transaction_date: new Date(),
      })

    const result = await supertest(app)
      .put(`/api/v1/transaction/${createTrx.body.data.transaction.id}`)
      .set("Authorization", "Bearer transactiontest")
      .send({
        id: createTrx.body.data.transaction.id,
        account_id: account?.id,
        category_id: category?.id,
        amount: "5000.00",
        description: "test transaction",
        transaction_date: new Date(),
      })
    
    logger.debug(result.body)
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Transaction updated successfully");
    expect(result.body.data.transaction.account.balance).toBe("5000");
  });

  it('should error if amount greater then balance', async () => {
    const [account, category] = await getDataForTransaction();
    const createTrx = await supertest(app)
      .post("/api/v1/transaction")
      .set("Authorization", "Bearer transactiontest")
      .send({
        account_id: account?.id,
        category_id: category?.id,
        amount: "5000.00",
        description: "test transaction",
        transaction_date: new Date(),
      })

    const result = await supertest(app)
      .put(`/api/v1/transaction/${createTrx.body.data.transaction.id}`)
      .set("Authorization", "Bearer transactiontest")
      .send({
        id: createTrx.body.data.transaction.id,
        account_id: account?.id,
        category_id: category?.id,
        amount: "10500.00",
        description: "test transaction",
        transaction_date: new Date(),
      })
    
    logger.debug(result.body)
    
    expect(result.status).toBe(422);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Insufficient balance for this transaction");
    expect(result.body.errors).toBeDefined();
  });
  
  it('should error if data invalid', async () => {
    const [account, category] = await getDataForTransaction();
    const createTrx = await supertest(app)
      .post("/api/v1/transaction")
      .set("Authorization", "Bearer transactiontest")
      .send({
        account_id: account?.id,
        category_id: category?.id,
        amount: "5000.00",
        description: "test transaction",
        transaction_date: new Date(),
      })

    const result = await supertest(app)
      .put(`/api/v1/transaction/${createTrx.body.data.transaction.id}`)
      .set("Authorization", "Bearer transactiontest")
      .send({
        id: createTrx.body.data.transaction.id,
        account_id: randomUUID(),
        category_id: category?.id,
        amount: "10500.00",
        description: "test transaction",
        transaction_date: new Date(),
      })
    
    logger.debug(result.body)
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Transaction not found");
  });
});

describe('DELETE /accounts/{id}', () => {
  beforeEach(async () => {
    await createTestUserForTransaction();
    await createAccountForTransaction();
    await createCategoryForTransaction();
  })

  afterEach(async () => {
    await removeTransaction()
    await removeTestUserForTransaction()
  });
  
  it('should can delete transaction', async () => {
    const [account, category] = await getDataForTransaction();
    const create = await supertest(app)
      .post("/api/v1/transaction")
      .set("Authorization", "Bearer transactiontest")
      .send({
        account_id: account?.id,
        category_id: category?.id,
        amount: "5000.00",
        description: "test transaction",
        transaction_date: new Date(),
      });
    
    const trxId = create.body.data.transaction.id;
    
    const result = await supertest(app)
      .delete(`/api/v1/transaction/${trxId}`)
      .set("Authorization", "Bearer transactiontest");
    
    logger.debug(result.body)
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Transaction deleted successfully");
    expect(create.body.data.deleted_at).toBeFalsy();
    expect(result.body.data.deleted_at).toBeDefined();

  });

  it('should error 404 if params invalid', async () => {
    const result = await supertest(app)
      .delete(`/api/v1/transaction/salah`)
      .set("Authorization", "Bearer transactiontest")
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data not found");
  });
})