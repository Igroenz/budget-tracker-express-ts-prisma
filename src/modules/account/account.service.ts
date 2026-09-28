import { logger } from "../../config/logging.js";
import { NotFoundError } from "../../helpers/app-error.js";
import { isUser, ValidatorDataUnknown } from "../../helpers/unknown-check.js";
import { AccountRepository } from "./account.repository.js";
import type { AccountCreateDTO, AccountParamsDTO, AccountQueryDTO, AccountUpdateDTO } from "./account.validator.js";


export class AccountService {
  constructor(
    private accountRepository = new AccountRepository(),
  ) { };

  async create(user: unknown, dto: AccountCreateDTO) {
    const { id } = ValidatorDataUnknown(user, isUser);
    return this.accountRepository.create(id, dto);
  };

  async search(user: unknown, dto: AccountQueryDTO) {
    const { id } = ValidatorDataUnknown(user, isUser);
    const dtoPage = Number(dto.page) || 1;
    const dtoLimit = Number(dto.limit) || 10;
    const skip = (dtoPage - 1) * dtoLimit;

    const filters: Record<string, string | number | null>[] = [];
    filters.push({ user_id: id });
    filters.push({ deleted_at: null })

    if (dto.name) filters.push({ name: dto.name });
    if (dto.type) filters.push({ type: dto.type });

    const [account, totalItems] = await this.accountRepository.search(filters, skip, dtoLimit)
    return {
      data: account,
      meta: {
        page: dtoPage,
        total_items: totalItems,
        total_page: Math.ceil(totalItems/dtoLimit),
      },
    }
  };

  async get(params: AccountParamsDTO) {
    const data = await this.accountRepository.getById(params.id);
    if (!data) throw new NotFoundError("Data not found")
    return data;
  };
  
  async update(dto: AccountUpdateDTO) {
    const data = await this.accountRepository.getById(dto.id);
    if (!data) throw new NotFoundError("Data not found");

    return this.accountRepository.update(dto);
  };



  async remove(params: AccountParamsDTO) {
    const checkData = await this.accountRepository.getById(params.id);
    if (!checkData) throw new NotFoundError("Data not found")
    
    return this.accountRepository.remove(params.id);
  }
}