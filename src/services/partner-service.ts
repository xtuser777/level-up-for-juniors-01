import { Database } from "../database";
import { UserModel } from "../models/user-model";
import { PartnerModel } from "../models/partner-model";
import { PartnersRepository } from "../repositories/partners-repository";
import { UsersRepository } from "../repositories/users-repository";

export class PartnerService {
  private usersRepository: UsersRepository;
  private partnersRepository: PartnersRepository;

  constructor() { 
    this.usersRepository = new UsersRepository();
    this.partnersRepository = new PartnersRepository();
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    companyName: string;
  }) {
    const { name, email, password, companyName } = data;

    const connection = await Database.getInstance().getConnection();

    try {
      await connection.beginTransaction();

      const user = UserModel.create(
        {
          name,
          email,
          password,
        }
      );

      const partner = PartnerModel.create(
        {
          companyName,
          userId: user.id,
        }
      );

      await this.usersRepository.create(user, connection);

      await this.partnersRepository.create(partner, connection);

      await connection.commit();
      return {
        id: partner.id,
        name,
        userId: user.id,
        companyName,
        created_at: partner.createdAt,
      };
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  }

  async findByUserId(userId: number) {
    return this.partnersRepository.findByUserId(userId);
  }
}
