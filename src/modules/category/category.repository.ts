import { prisma } from "../../config/db.js";
import type { CategoryCreateDTO, CategoryQueryDTO, CategoryUpdateDTO } from "./category.validator.js";

export class CategoryRepository {
  async findCategory(user_id: string, name: string) {
    return prisma.category.count({
      where: {
        user_id: user_id,
        name: name
      }
    })
  };

  async findById(id: number) {
    return prisma.category.findUnique({
      where: {id: id}
    })
  };

  async findAll(user_id: string, query: CategoryQueryDTO) {
    return prisma.category.findMany({
      where: {
        user_id: user_id,
        type: query.type
      }
    })
  }

  async create(user_id: string, data: CategoryCreateDTO) {
    return prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
        user_id: user_id,
      }
    })
  };

  async update(user_id: string, data: CategoryUpdateDTO) {
    return prisma.category.update({
      where: {
        user_id: user_id,
        id: data.id,
      },
      data: {
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
      }
    })
  };

  async remove(user_id: string, id: number) {
    return prisma.category.delete({
      where: {
        user_id: user_id,
        id: id,
      }
    })
  };
}