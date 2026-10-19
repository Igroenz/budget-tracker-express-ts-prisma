import { NotFoundError } from "../../helpers/app-error.js";
import { isUser, ValidatorDataUnknown } from "../../helpers/unknown-check.js";
import { TransferRepository } from "./transfer.repository.js";
import type { TransferCreateDTO, TransferIdDTO } from "./transfer.validator.js";

export class TransferService {
  constructor(
    private transferRepository = new TransferRepository(),
  ) { };

  async create(user: unknown, dto: TransferCreateDTO) {
    const { id } = ValidatorDataUnknown(user, isUser);

    return this.transferRepository.create(id, dto);
  };

  async get(params:TransferIdDTO) {
    const data = await this.transferRepository.findById(params.id);
    if (!data) throw new NotFoundError("Data not found")
    
    return data;
  };

  async remove(params: TransferIdDTO) {
    const data = await this.transferRepository.findById(params.id);
    if (!data) throw new NotFoundError("Data not found")

    return this.transferRepository.remove(params.id);
  }
}