import { UsersRepository } from "../repositories/users-repository";

export class UserService {
  private usersRepository: UsersRepository;
  
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async findById(userId: number) {
    return this.usersRepository.findById(userId);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }
}
