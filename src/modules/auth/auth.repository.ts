import { prisma } from "../../config/db.js";
import type { AuthLoginDTO, AuthRegisterDTO } from "./auth.validator.js";

export class AuthRepository {
  async countByEmail(email: string): Promise<number> {
    return prisma.user.count({
      where: { email: email}
    })
  };

  async register(data: AuthRegisterDTO) {
    return prisma.user.create({
      data: data,
      select: {
        email: true,
        name: true,
      },
    });
  };

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email },
      select: {
        email: true,
        password: true,
      },
    });
  };

  async findByToken(token: string) {
    return prisma.user.findFirst({
      where: { token: token },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  };

  async login(data: AuthLoginDTO & {token: string}) {
    return prisma.user.update({
      where: { email: data.email },
      data: { token: data.token },
      select: {
        id: true,
        name: true,
        email: true,
        token: true,
      },
    });
  };

  async logout(id: string) {
    return prisma.user.update({
      where: { id: id },
      data: { token: null },
      select: {email: true}
    });
  };
};