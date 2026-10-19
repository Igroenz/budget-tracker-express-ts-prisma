import bcrypt from "bcryptjs";
import { prisma } from "../src/config/db"
import { CategoryTypeEnum } from "../src/generated/prisma/enums";

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

// Category
export const createTestUserForCategory = async () => {
  await prisma.user.create({
    data: {
      email: "category@test.com",
      name: "test name",
      token: "categorytest",
      password: await bcrypt.hash("test", 10),
    }
  })
};

export const removeTestUserForCategory = async () => {
  await prisma.user.deleteMany({
    where: {email: "category@test.com",}
  });
};

const dataCategories = [
  {
    name: "Gaji",
    type: CategoryTypeEnum.INCOME,
    icon: "circle-dollar-sign",
    color: "#4cb3a0",
    user: { connect: { email: "category@test.com" } }
  },
  {
    name: "Investasi",
    type: CategoryTypeEnum.INCOME,
    icon: "chart-line",
    color: "#0084d1",
    user: { connect: { email: "category@test.com" } }
  },
  {
    name: "Bonus",
    type: CategoryTypeEnum.INCOME,
    icon: "trophy",
    color: "#0092b8",
    user: { connect: { email: "category@test.com" } }
  },
  {
    name: "Debts",
    type: CategoryTypeEnum.EXPENSE,
    icon: "wallet-cards",
    color: "#9f2d00",
    user: { connect: { email: "category@test.com" } }
  },
  {
    name: "Spends",
    type: CategoryTypeEnum.EXPENSE,
    icon: "shopping-cart",
    color: "#9f0712",
    user: { connect: { email: "category@test.com" } }
  },
  {
    name: "Bills",
    type: CategoryTypeEnum.EXPENSE,
    icon: "receipt-text",
    color: "#ffba00",
    user: { connect: { email: "category@test.com" } }
  },
];

export const createTestCategories = async () => {
  for (const item of dataCategories) {
    await prisma.category.create({
      data: item
    })
  }
};

export const getTestCategoryForCategory = async () => {
  return prisma.category.findFirst({
    where: {user: {email: "category@test.com"}},
  })
}

// Transactions
export const createTestUserForTransaction = async () => {
  await prisma.user.create({
    data: {
      email: "transaction@test.com",
      name: "test name",
      token: "transactiontest",
      password: await bcrypt.hash("test", 10),
    }
  })
};

export const removeTestUserForTransaction = async () => {
  await prisma.user.deleteMany({
    where: {email: "transaction@test.com",}
  });
};

export const createAccountForTransaction = async () => {
  await prisma.account.create({
    data: {
        name: `Bank XXX`,
        type: "BANK",
        balance: 10000,
        currency: "IDR",
        user: {
          connect: { email: "transaction@test.com" }
        }
      }
  })
}

export const removeAccountForTransaction = async () => {
  await prisma.account.deleteMany({
    where: {user_id: "transaction@test.com"}
  })
}

export const createCategoryForTransaction = async () => {
  await prisma.category.create({
    data: {
      name: "Spends",
      type: CategoryTypeEnum.EXPENSE,
      icon: "shopping-cart",
      color: "#9f0712",
      user: { connect: { email: "transaction@test.com" } }
    }
  })
}

export const getDataForTransaction = async () => {
  const account = await prisma.account.findFirst({
    where: { user: { email: "transaction@test.com" } },
  });
  const category = await prisma.category.findFirst({
    where: { user: { email: "transaction@test.com" } },
  });

  return [account, category];
}

export const removeTransaction = async () => {
  await prisma.transaction.deleteMany({
    where: { user: { email: "transaction@test.com" } },
  })
}

// Tranfers
export const createTestUserForTransfer = async () => {
  await prisma.user.create({
    data: {
      email: "transfer@test.com",
      name: "test name",
      token: "transfertest",
      password: await bcrypt.hash("test", 10),
    }
  })
};

export const removeTestUserForTransfer = async () => {
  await prisma.user.deleteMany({
    where: {email: "transfer@test.com",}
  });
};

export const createAccountForTransfer = async () => {
  for (let i = 1; i < 3; i++) {
    const balance = i * 1000;
    await prisma.account.create({
      data: {
        name: `Bank ${i}`,
        type: "BANK",
        balance: balance,
        currency: "IDR",
        user: {
          connect: { email: "transfer@test.com" }
        }
      },
    });
  }
}

export const removeAccountForTransfer = async () => {
  await prisma.account.deleteMany({
    where: {user_id: "transfer@test.com"}
  })
}

export const getTestAccountForTransfer = async () => {
  return prisma.account.findMany({
    where: { user: { email: "transfer@test.com" } },
    orderBy: [{ name: "asc" }],
  });
}

export const removeTransfer = async () => {
  await prisma.transfer.deleteMany({
    where: { user: { email: "transfer@test.com" } },
  })
}
