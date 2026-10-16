import { NotFoundError } from "../../helpers/app-error.js";
import { isUser, ValidatorDataUnknown } from "../../helpers/unknown-check.js";
import { CategoryRepository } from "../category/category.repository.js";
import { TransactionRepository } from "./transaction.repository.js";
import type { TransactionCreateDTO, TransactionGetDTO, TransactionRemoveDTO, TransactionUpdateDTO } from "./transaction.validator.js";

export class TransactionService {
  constructor(
    private categoryRepository = new CategoryRepository(),
    private transactionRepository = new TransactionRepository(),
  ) { };

  async create(user: unknown, dto: TransactionCreateDTO) {
    const { id } = ValidatorDataUnknown(user, isUser);
    
    const category = await this.categoryRepository.findById(dto.category_id)
    if (!category) throw new NotFoundError("Category not found");

    return this.transactionRepository.create(id, dto);
  };

  async get(params:TransactionGetDTO) {
    const data = await this.transactionRepository.findById(params.id);
    if (!data) throw new NotFoundError("Data not found")
    
    return data;
  };

  async update(user: unknown, dto: TransactionUpdateDTO) {
    const { id } = ValidatorDataUnknown(user, isUser);

    const category = await this.categoryRepository.findById(dto.category_id)
    if (!category) throw new NotFoundError("Category not found");

    return this.transactionRepository.update(id, dto);
  };

  async remove(params: TransactionRemoveDTO) {
    const data = await this.transactionRepository.findById(params.id);
    if (!data) throw new NotFoundError("Data not found")

    return this.transactionRepository.remove(params.id);
  }
}