import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsersRepository } from "../repositories/users-repository";

export class AuthService {
  private usersRepository: UsersRepository
  
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async login(email: string, password: string) {
    const userModel = await this.usersRepository.findByEmail(email);
    if (userModel && bcrypt.compareSync(password, userModel.password)) {
      return jwt.sign({ id: userModel.id, email: userModel.email }, "123456", {
        expiresIn: "1h",
      });
    } else {
      throw new InvalidCredentialsError();
    }
  }
}

export class InvalidCredentialsError extends Error {}
