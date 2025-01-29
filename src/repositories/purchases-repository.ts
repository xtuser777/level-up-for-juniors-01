import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { PurchaseModel } from "../models/purchase-model";
import { Database } from "../database";

export class PurchasesRepository {
  async create(model: PurchaseModel, connection?: PoolConnection): Promise<PurchaseModel> {
    const db = connection ?? Database.getInstance();
    
    await db.execute<ResultSetHeader>(
      "INSERT INTO purchases (id, customer_id, total_amount, status, purchase_date) VALUES (?, ?, ?, ?, ?)",
      [model.id, model.customerId, model.totalAmount, model.status, model.purchaseDate]
    );

    return model;
  }

  async update(model: PurchaseModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE purchases SET customer_id = ?, total_amount = ?, status = ? WHERE id = ?",
      [model.customerId, model.totalAmount, model.status, model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Purchase not found");
    }
  }

  async delete(model: PurchaseModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM purchases WHERE id = ?",
      [model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Purchase not found");
    }
  }

  async findById(id: number): Promise<PurchaseModel | null> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM purchases WHERE id = ?",
      [id]
    );

    return rows.length ? PurchaseModel.load({
      id: rows[0].id,
      status: rows[0].status,
      purchaseDate: rows[0].purchase_date,
      totalAmount: rows[0].total_amount,
      customerId: rows[0].customer_id,
    }) : null;
  }

  async findAll(): Promise<PurchaseModel[]> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM purchases");

    return rows.map((row) => PurchaseModel.load({
      id: row.id,
      status: row.status,
      purchaseDate: row.purchase_date,
      totalAmount: row.total_amount,
      customerId: row.customer_id,
    }));
  }
}