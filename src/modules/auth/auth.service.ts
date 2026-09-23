import bcrypt, { compare } from "bcryptjs";
import { ConflictError, UnauthorizedError } from "../../helpers/app-error.js";
import { AuthRepository } from "./auth.repository.js";
import type { AuthLoginDTO, AuthRegisterDTO, UserDTO } from "./auth.validator.js";
import { v4 as uuid } from "uuid";
import { isUser, ValidatorDataUnknown } from "../../helpers/unknown-check.js";


export class AuthService {
  constructor(
    private authRepo = new AuthRepository(),
  ) { }
  
  async register(dto: AuthRegisterDTO) {
    const checkEmail = await this.authRepo.countByEmail(dto.email);

    if (checkEmail !== 0) throw new ConflictError("Data sudah ada");

    const hashPassword = await bcrypt.hash(dto.password, 10);
    dto.password = hashPassword;

    return this.authRepo.register(dto);
  };

  async login(dto: AuthLoginDTO) {
    const user = await this.authRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedError("Invalid email or password")
      
    const isPasswordValid = await compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError("Invalid email or password")
    
    const token = uuid().toString();
    const result = await this.authRepo.login({ ...dto, token });

    return {
      "accessToken": result.token,
      "tokenType": "Bearer",
    };
  };

  async logout(dto: unknown) {
    const user = ValidatorDataUnknown(dto, isUser);
    return this.authRepo.logout(user.id);
  };
}