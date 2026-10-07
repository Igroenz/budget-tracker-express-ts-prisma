import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {createTestCategories, createTestUserForCategory, getTestCategoryForCategory, removeTestUserForCategory } from "../utils";
import supertest from "supertest";
import app from "../../src/application/app";
import { CategoryTypeEnum } from "../../src/generated/prisma/enums";

describe('POST /category', () => {
  beforeEach(async () => {
    await createTestUserForCategory()
  })

  afterEach(async () => {
    await removeTestUserForCategory()
  });

  it('should reject if token invalid', async () => {
    const result = await supertest(app)
      .post("/api/v1/category")
      .set("Authorization", "Bearer salah");
    
    expect(result.status).toBe(401);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Token tidak valid atau kedaluwarsa");
  });

  it('should reject if request invalid', async () => {
    const result = await supertest(app)
      .post("/api/v1/category")
      .set("Authorization", "Bearer categorytest")
      .send({
        name: "",
        type: "",
        icon: "",
        color: "",
      });
    
    expect(result.status).toBe(422);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Validasi gagal");
    expect(result.body.errors).toBeDefined();
  });

  it('should can create category', async () => {
    const result = await supertest(app)
      .post("/api/v1/category")
      .set("Authorization", "Bearer categorytest")
      .send({
        name: "Gaji",
        type: "INCOME",
        icon: "circle-dollar-sign",
        color: "#4cb3a0",
      });
    
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Category created successfully");
    expect(result.body.data.name).toBe("Gaji");
    expect(result.body.data.type).toBe("INCOME");
  });
});

describe('GET /category', () => {
  beforeEach(async () => {
    await createTestUserForCategory();
    await createTestCategories();
  });

  afterEach(async () => {
    await removeTestUserForCategory()
  });

  it('should can get categories', async () => {
    const result = await supertest(app)
      .get('/api/v1/category')
      .set("Authorization", "Bearer categorytest")
      .query({
        type: "INCOME"
      });
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Categories retrieved successfully");
    expect(result.body.data).toBeDefined();
  });
});

describe('GET /category/{id}', () => {
  beforeEach(async () => {
    await createTestUserForCategory();
    await createTestCategories();
  });

  afterEach(async () => {
    await removeTestUserForCategory()
  });

  it('should error 404 if params invalid', async () => {
    const result = await supertest(app)
      .get(`/api/v1/category/190`)
      .set("Authorization", "Bearer categorytest")
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data not found");
  });
  it('should can get detail category', async () => {
    const category = await getTestCategoryForCategory();
    const result = await supertest(app)
      .get(`/api/v1/category/${category?.id}`)
      .set("Authorization", "Bearer categorytest");
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Detail category retrieved successfully");
    expect(result.body.data).toBeDefined();

  });
})

describe('PUT /category/{id}', () => {
  beforeEach(async () => {
    await createTestUserForCategory();
    await createTestCategories();
  });

  afterEach(async () => {
    await removeTestUserForCategory()
  });

  it('should error 404 if data id not found', async () => {
    const category = await getTestCategoryForCategory();
    const result = await supertest(app)
      .put(`/api/v1/category/${category?.id}`)
      .set("Authorization", "Bearer categorytest")
      .send({
        id: '1000',
        name: "Fee ADM",
        type: CategoryTypeEnum.EXPENSE,
        icon: "circle-dollar-sign",
        color: "#ff6467",
      });
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data not found");
  });
  it('should reject if request invalid', async () => {
    const category = await getTestCategoryForCategory();
    const result = await supertest(app)
      .put(`/api/v1/category/${category?.id}`)
      .set("Authorization", "Bearer categorytest")
      .send({
        id: category?.id,
        name: "Fee ADM",
        type: "SAVING",
        icon: "circle-dollar-sign",
        color: "#ff6467",
      });
    
    expect(result.status).toBe(422);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Validasi gagal");
    expect(result.body.errors).toBeDefined();
  });
  it('should can update detail category', async () => {
    const category = await getTestCategoryForCategory();
    const result = await supertest(app)
      .put(`/api/v1/category/${category?.id}`)
      .set("Authorization", "Bearer categorytest")
      .send({
        id: category?.id,
        name: "Fee ADM",
        type: CategoryTypeEnum.EXPENSE,
        icon: "hand-coins",
        color: "#ff6467",
      });
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Category updated successfully");
    expect(result.body.data).toBeDefined();
  });
});

describe('DELETE /accounts/{id}', () => {
      beforeEach(async () => {
      await createTestUserForCategory();
      await createTestCategories();
    });

    afterEach(async () => {
      await removeTestUserForCategory()
    });
  
  it('should can delete account', async () => {
    const category = await getTestCategoryForCategory();
    const result = await supertest(app)
      .delete(`/api/v1/category/${category?.id}`)
      .set("Authorization", "Bearer categorytest");
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Category deleted successfully");
  });

  it('should error 404 if params invalid', async () => {
    const result = await supertest(app)
      .delete(`/api/v1/accounts/888`)
      .set("Authorization", "Bearer categorytest")
    
    expect(result.status).toBe(404);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data not found");
  });
})