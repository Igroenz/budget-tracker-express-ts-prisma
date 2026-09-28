import bcrypt from "bcryptjs";
import { prisma } from "../src/config/db"

export const createTestUser = async () => {
  await prisma.user.create({
    data: {
      email: "test@test.com",
      name: "test name",
      token: "test",
      password: await bcrypt.hash("test", 10),
    }
  })
};

export const removeTestUser = async () => {
  await prisma.user.deleteMany({
    where: {email: "test@test.com",}
  });
};

// Account
export const createTestUserForAccount = async () => {
  await prisma.user.create({
    data: {
      email: "account@test.com",
      name: "test name",
      token: "accounttest",
      password: await bcrypt.hash("test", 10),
    }
  })
};

export const removeTestUserForAccount = async () => {
  await prisma.user.deleteMany({
    where: {email: "account@test.com",}
  });
};

export const createTestAccount = async () => {
  for (let i = 0; i < 15; i++) {
    await prisma.account.create({
      data: {
        name: `Bank ${i}`,
        type: "BANK",
        balance: 1000000,
        currency: "IDR",
        user: {
          connect: { email: "account@test.com" }
        }
      }
    });
  }
}

export const getTestAccountForAccount = async () => {
  return prisma.account.findFirst({
    where: {user: {email: "account@test.com"}},
  })
}