import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Database } from "../database";
import { UserModel } from "../models/user-model";

export class UsersRepository {
  async create(model: UserModel, connection?: PoolConnection): Promise<UserModel> {
    const db = connection ?? Database.getInstance();

    await db.execute<ResultSetHeader>(
      "INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)",
      [model.id, model.name, model.email, model.password, model.createdAt]
    );

    return model;
  }

  async update(model: UserModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [model.name, model.email, model.password, model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("User not found");
    }
  }

  async delete(model: UserModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM users WHERE id = ?",
      [model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("User not found");
    }
  }

  async findAll(): Promise<UserModel[]> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM users");

    return rows.map((row) => UserModel.load({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      createdAt: row.created_at,
    }));
  }

  async findById(id: number): Promise<UserModel | null> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    return rows.length ? UserModel.load({
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      password: rows[0].password,
      createdAt: rows[0].created_at,
    }) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    return rows.length ? UserModel.load({
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      password: rows[0].password,
      createdAt: rows[0].created_at,
    }) : null;
  }
}