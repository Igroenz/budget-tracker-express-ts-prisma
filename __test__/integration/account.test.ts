import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestAccount, createTestUserForAccount, getTestAccountForAccount, removeTestUserForAccount } from "../utils";
import supertest from "supertest";
import app from "../../src/application/app";

describe('POST /accounts', () => {
  beforeEach(async () => {
    await createTestUserForAccount()
  })

  afterEach(async () => {
    await removeTestUserForAccount()
  });

  it('should reject if token invalid', async () => {
    const result = await supertest(app)
      .post("/api/v1/accounts")
      .set("Authorization", "Bearer salah");
    
    expect(result.status).toBe(401);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Token tidak valid atau kedaluwarsa");
  });

  it('should reject if request name invalid', async () => {
    const result = await supertest(app)
      .post("/api/v1/accounts")
      .set("Authorization", "Bearer accounttest")
      .send({
        name: "",
        type: "",
        balance: 0,
        currency: undefined,
      });
    
    expect(result.status).toBe(422);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Validasi gagal");
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if request type invalid', async () => {
    const result = await supertest(app)
      .post("/api/v1/accounts")
      .set("Authorization", "Bearer accounttest")
      .send({
        name: "BCA",
        type: "BANG",
        balance: 1000000,
        currency: "IDR",
      });
    
    expect(result.status).toBe(422);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Validasi gagal");
    expect(result.body.errors).toBeDefined();
  });

  it('should can create account', async () => {
    const result = await supertest(app)
      .post("/api/v1/accounts")
      .set("Authorization", "Bearer accounttest")
      .send({
        name: "Bank BCA",
        type: "BANK",
        balance: 1000000,
        currency: "IDR",
      });
    
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Account created successfully");
    expect(result.body.data.name).toBe("Bank BCA");
  });
});

describe('GET /accounts', () => {
  beforeEach(async () => {
    await createTestUserForAccount();
    await createTestAccount();
  });

  afterEach(async () => {
    await removeTestUserForAccount()
  });

  it('should can get without parameters', async () => {
    const result = await supertest(app)
      .get('/api/v1/accounts')
      .set("Authorization", "Bearer accounttest")
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Account retrieved successfully");
    expect(result.body.data.length).toBe(10);
    expect(result.body.meta.page).toBe(1);
    expect(result.body.meta.total_items).toBe(15);
    expect(result.body.meta.total_page).toBe(2);
  });

  it('should can get with page parameters', async () => {
    const result = await supertest(app)
      .get('/api/v1/accounts')
      .set("Authorization", "Bearer accounttest")
      .query({
        page: 2
      });
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Account retrieved successfully");
    expect(result.body.data.length).toBe(5);
    expect(result.body.meta.page).toBe(2);
    expect(result.body.meta.total_items).toBe(15);
    expect(result.body.meta.total_page).toBe(2);
  });

  it('should can get with limit parameters', async () => {
    const result = await supertest(app)
      .get('/api/v1/accounts')
      .set("Authorization", "Bearer accounttest")
      .query({
        page: 2,
        limit: 5
      });
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Account retrieved successfully");
    expect(result.body.data.length).toBe(5);
    expect(result.body.meta.page).toBe(2);
    expect(result.body.meta.total_items).toBe(15);
    expect(result.body.meta.total_page).toBe(3);
  })
});

describe('GET /accounts/{id}', () => {
  beforeEach(async () => {
    await createTestUserForAccount();
    await createTestAccount();
  });

  afterEach(async () => {
    await removeTestUserForAccount()
  });

  it('should error 404 if params invalid', async () => {
    const result = await supertest(app)
      .get(`/api/v1/accounts/salah`)
      .set("Authorization", "Bearer accounttest")
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data not found");
  });
  it('should can get detail account', async () => {
    const account = await getTestAccountForAccount();
    const result = await supertest(app)
      .get(`/api/v1/accounts/${account?.id}`)
      .set("Authorization", "Bearer accounttest");
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Detail account retrieved successfully");
    expect(result.body.data).toBeDefined();

  });
})

describe('PUT /accounts/{id}', () => {
  beforeEach(async () => {
    await createTestUserForAccount();
    await createTestAccount();
  });

  afterEach(async () => {
    await removeTestUserForAccount()
  });

  it('should error 404 if data id not found', async () => {
    const account = await getTestAccountForAccount();
    const result = await supertest(app)
      .put(`/api/v1/accounts/${account?.id}`)
      .set("Authorization", "Bearer accounttest")
      .send({
        id: '123',
        name: "BCA",
        type: "BANK",
        balance: 1000000,
        currency: "IDR",
      });
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data not found");
  });
  it('should reject if request invalid', async () => {
    const account = await getTestAccountForAccount();
    const result = await supertest(app)
      .put(`/api/v1/accounts/${account?.id}`)
      .set("Authorization", "Bearer accounttest")
      .send({
        id: account?.id,
        name: "BCA",
        type: "gopay",
        balance: 1000000,
        currency: "IDR",
      });
    
    expect(result.status).toBe(422);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Validasi gagal");
    expect(result.body.errors).toBeDefined();
  });
  it('should can update detail account', async () => {
    const account = await getTestAccountForAccount();
    const result = await supertest(app)
      .put(`/api/v1/accounts/${account?.id}`)
      .set("Authorization", "Bearer accounttest")
      .send({
        id: account?.id,
        name: "GoPay",
        type: "E_WALLET",
        balance: 600000,
        currency: "IDR",
      });
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Account updated successfully");
    expect(result.body.data).toBeDefined();

  });
});

describe('DELETE /accounts/{id}', () => {
      beforeEach(async () => {
      await createTestUserForAccount();
      await createTestAccount();
    });

    afterEach(async () => {
      await removeTestUserForAccount()
    });
  
  it('should can delete account', async () => {
    const account = await getTestAccountForAccount();
    const result = await supertest(app)
      .delete(`/api/v1/accounts/${account?.id}`)
      .set("Authorization", "Bearer accounttest");
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Account deleted successfully");
  });

  it('should error 404 if params invalid', async () => {
    const result = await supertest(app)
      .delete(`/api/v1/accounts/salah`)
      .set("Authorization", "Bearer accounttest")
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data not found");
  });
})