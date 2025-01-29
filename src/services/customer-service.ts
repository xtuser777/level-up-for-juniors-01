import { UserModel } from "../models/user-model";
import { Database } from "../database";
import { CustomerModel } from "../models/customer-model";
import { CustomersRepository } from "../repositories/customers-repository";
import { UsersRepository } from "../repositories/users-repository";

export class CustomerService {
  private customersRepository: CustomersRepository;
  private usersRepository: UsersRepository;

  constructor() {
    this.customersRepository = new CustomersRepository();
    this.usersRepository = new UsersRepository();
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
  }) {
    const { name, email, password, address, phone } = data;

    const connection = await Database.getInstance().getConnection();

    try {
      await connection.beginTransaction();

      const user = UserModel.create({
        name,
        email,
        password,
      });

      const customer = CustomerModel.create({
        userId: user.id,
        address,
        phone,
      });

      await this.usersRepository.create(user, connection);

      await this.customersRepository.create(customer, connection);

      await connection.commit();

      return {
        id: customer.id,
        name,
        userId: user.id,
        address,
        phone,
        createdAt: customer.createdAt,
      };
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  }

  async findByUserId(userId: number): Promise<CustomerModel | null> {
    return this.customersRepository.findByUserId(userId, { user: true });
  }
}
