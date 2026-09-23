import { afterEach, beforeEach, describe, expect, it } from "vitest";
import supertest from "supertest";
import app from "../../src/application/app";
import { createTestUser, removeTestUser } from "../utils";

describe('POST /register', () => {
  afterEach(async () => {
    await removeTestUser()
  });

  it("should can register new user", async () => {
    const result = await supertest(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test name",
        email: "test@test.com",
        password: "test"
      });
    
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("User registered successfully");
    expect(result.body.data.name).toBe("test name");
    expect(result.body.data.email).toBe("test@test.com");
  });

  it("should reject if request invalid", async () => {
    const result = await supertest(app)
      .post("/api/v1/auth/register")
      .send({
        name: "",
        email: "",
        password: ""
      });
    
    expect(result.status).toBe(422);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Validasi gagal");
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if email already exist", async () => {
    let result = await supertest(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test name",
        email: "test@test.com",
        password: "test"
      });
    
    result = await supertest(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test name 1",
        email: "test@test.com",
        password: "test"
      });
    
    expect(result.status).toBe(409);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Data sudah ada");
  });
});

describe('POST /login', () => {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  });

  it("should user can login", async () => {
    const result = await supertest(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@test.com",
        password: "test"
      });
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Login successful");
    expect(result.body.data.accessToken).toBeDefined();
    expect(result.body.data.tokenType).toBe("Bearer");
  });

  it("should reject if request invalid", async () => {
    const result = await supertest(app)
      .post("/api/v1/auth/login")
      .send({
        email: "",
        password: ""
      });
    
    expect(result.status).toBe(422);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Validasi gagal");
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if password wrong", async () => {
    const result = await supertest(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@test.com",
        password: "test1"
      });
    
    expect(result.status).toBe(401);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Invalid email or password");
  });
});
  
describe('DELETE /logout', () => {
    beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  });

  it("should user can logout", async () => {
    const result = await supertest(app)
      .delete("/api/v1/auth/logout")
      .set("Authorization", "Bearer test");
    
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Logout successful");
  });

  it("should reject if token invalid", async () => {
    const result = await supertest(app)
      .delete("/api/v1/auth/logout")
      .set("Authorization", "Bearer salah");
    
    expect(result.status).toBe(401);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe("Token tidak valid atau kedaluwarsa");
  });
});