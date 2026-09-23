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
}

export const removeTestUser = async () => {
  await prisma.user.deleteMany({});
};