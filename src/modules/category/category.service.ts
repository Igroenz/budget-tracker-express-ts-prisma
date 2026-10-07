import { ConflictError, NotFoundError } from "../../helpers/app-error.js";
import { isUser, ValidatorDataUnknown } from "../../helpers/unknown-check.js";
import { CategoryRepository } from "./category.repository.js";
import type { CategoryCreateDTO, CategoryParamsId, CategoryQueryDTO, CategoryUpdateDTO } from "./category.validator.js";

export class CategoryService {
  constructor(
    private categoryRepository = new CategoryRepository(),
  ) { }
  
  async create(user: unknown, dto: CategoryCreateDTO) {
    const { id } = ValidatorDataUnknown(user, isUser);
    const checkCategory = await this.categoryRepository.findCategory(id, dto.name);
    if (checkCategory !== 0) throw new ConflictError("Data sudah ada");

    return this.categoryRepository.create(id, dto)
  };

  async get(params: CategoryParamsId) {
    const data = await this.categoryRepository.findById(params.id);
    if (!data) throw new NotFoundError("Data not found");

    return data;
  };

  async getAll(user: unknown, query: CategoryQueryDTO) {
    const { id } = ValidatorDataUnknown(user, isUser);
    return this.categoryRepository.findAll(id, query);
  };

  async update(user: unknown, dto: CategoryUpdateDTO) {
    const { id } = ValidatorDataUnknown(user, isUser);
    const checkCategory = await this.categoryRepository.findById(dto.id);
    if (!checkCategory) throw new NotFoundError("Data not found");
    
    return this.categoryRepository.update(id, dto) 
  };

  async remove(user: unknown, params: CategoryParamsId) {
    const { id } = ValidatorDataUnknown(user, isUser);
    const checkCategory = await this.categoryRepository.findById(params.id);
    if (!checkCategory) throw new NotFoundError("Data not found");

    return this.categoryRepository.remove(id, params.id);
  }
};