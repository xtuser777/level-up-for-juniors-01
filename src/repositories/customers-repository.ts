import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CustomerModel } from "../models/customer-model";
import { Database } from "../database";
import { UserModel } from "../models/user-model";

export class CustomersRepository {
  async create(model: CustomerModel, connection?: PoolConnection): Promise<CustomerModel> {
    const db = connection ?? Database.getInstance();
    
    await db.execute<ResultSetHeader>(
      "INSERT INTO customers (id, user_id, address, phone, created_at) VALUES (?, ?, ?, ?, ?)",
      [model.id, model.userId, model.address, model.phone, model.createdAt]
    );

    return model;
  }

  async update(model: CustomerModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE customers SET user_id = ?, address = ?, phone = ? WHERE id = ?",
      [model.userId, model.address, model.phone, model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Customer not found");
    }
  }

  async delete(model: CustomerModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM customers WHERE id = ?",
      [model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Customer not found");
    }
  }

  async findById(
    id: string,
    options?: { user?: boolean }
  ): Promise<CustomerModel | null> {
    const db = Database.getInstance();
    
    let query = "SELECT * FROM customers WHERE id = ?";

    if (options?.user) {
      query =
        "SELECT c.*, users.id as user_id, users.name as user_name, users.email as user_email FROM customers c JOIN users ON c.user_id = users.id WHERE c.id = ?";
    }

    const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) return null;

    const customer = CustomerModel.load({
      id: rows[0].id,
      address: rows[0].address,
      phone: rows[0].phone,
      userId: rows[0].user_id,
      createdAt: rows[0].created_at,
    });

    if (options?.user) {
      customer.user = UserModel.load({
        id: rows[0].user_id,
        name: rows[0].user_name,
        email: rows[0].user_email,
        password: '',
        createdAt: undefined,
      });
    }

    return customer;
  }

  async findByUserId(
    user_id: number,
    options?: { user?: boolean }
  ): Promise<CustomerModel | null> {
    const db = Database.getInstance();

    let query = "SELECT * FROM customers WHERE user_id = ?";

    if (options?.user) {
      query =
        "SELECT c.*, users.id as user_id, users.name as user_name, users.email as user_email FROM customers c JOIN users ON c.user_id = users.id WHERE c.user_id = ?";
    }

    const [rows] = await db.execute<RowDataPacket[]>(query, [user_id]);

    if (rows.length === 0) return null;

    const customer = CustomerModel.load({
      id: rows[0].id,
      address: rows[0].address,
      phone: rows[0].phone,
      userId: rows[0].user_id,
      createdAt: rows[0].created_at,
    });

    if (options?.user) {
      customer.user = UserModel.load({
        id: rows[0].user_id,
        name: rows[0].user_name,
        email: rows[0].user_email,
        password: '',
        createdAt: undefined,
      });
    }

    return customer;
  }

  async findAll(): Promise<CustomerModel[]> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM customers");

    return rows.map((row) => CustomerModel.load({
      id: row.id,
      address: row.address,
      phone: row.phone,
      userId: row.user_id,
      createdAt: row.created_at,
    }));
  }
}