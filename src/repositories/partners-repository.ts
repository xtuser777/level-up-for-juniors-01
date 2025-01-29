import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { PartnerModel } from "../models/partner-model";
import { Database } from "../database";
import { UserModel } from "../models/user-model";

export class PartnersRepository {
  async create(model: PartnerModel, connection?: PoolConnection): Promise<PartnerModel> {
    const db = connection ?? Database.getInstance();
    
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO partners (id, user_id, company_name, created_at) VALUES (?, ?, ?, ?)",
      [model.id, model.userId, model.companyName, model.createdAt]
    );

    return model;
  }

  async update(model: PartnerModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE partners SET user_id = ?, company_name = ? WHERE id = ?",
      [model.userId, model.companyName, model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Partner not found");
    }
  }

  async delete(model: PartnerModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM partners WHERE id = ?",
      [model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Partner not found");
    }
  }

  async findById(
    id: number,
    options?: { user?: boolean }
  ): Promise<PartnerModel | null> {
    const db = Database.getInstance();
    let query = "SELECT * FROM partners WHERE id = ?";
    if (options?.user) {
      query =
        "SELECT p.*, users.id as user_id, users.name as user_name, users.email as user_email FROM partners p JOIN users ON p.user_id = users.id WHERE p.id = ?";
    }
    const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) return null;

    const partner = PartnerModel.load({
      id: rows[0].id,
      companyName: rows[0].company_name,
      userId: rows[0].user_id,
      createdAt: rows[0].created_at,
    });

    if (options?.user) {
      partner.user = UserModel.load({
        id: rows[0].user_id,
        name: rows[0].user_name,
        email: rows[0].user_email,
        password: '',
        createdAt: undefined,
      });
    }

    return partner;
  }

  async findByUserId(
    userId: number,
    options?: { user?: boolean }
  ): Promise<PartnerModel | null> {
    const db = Database.getInstance();

    let query = "SELECT * FROM partners WHERE user_id = ?";

    if (options?.user) {
      query =
        "SELECT p.*, users.id as user_id, users.name as user_name, users.email as user_email FROM partners p JOIN users ON p.user_id = users.id WHERE p.user_id = ?";
    }
    
    const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);

    if (rows.length === 0) return null;

    const partner =  PartnerModel.load({
      id: rows[0].id,
      companyName: rows[0].company_name,
      userId: rows[0].user_id,
      createdAt: rows[0].created_at,
    });

    if (options?.user) {
      partner.user = UserModel.load({
        id: rows[0].user_id,
        name: rows[0].user_name,
        email: rows[0].user_email,
        password: '',
        createdAt: undefined,
      });
    }

    return partner;
  }

  async findAll(): Promise<PartnerModel[]> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM partners");

    return rows.map((row) => PartnerModel.load({
      id: row.id,
      companyName: row.company_name,
      userId: rows[0].user_id,
      createdAt: rows[0].created_at,
    }));
  }
}