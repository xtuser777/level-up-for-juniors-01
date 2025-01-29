import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Database } from "../database";
import { PurchaseTicketModel } from "../models/purchase-ticket-model";

export class PurchasesTicketsRepository {
  async create(model: PurchaseTicketModel, connection?: PoolConnection): Promise<PurchaseTicketModel> {
    const db = connection ?? Database.getInstance();

    await db.execute<ResultSetHeader>(
      "INSERT INTO purchase_tickets (id, purchase_id, ticket_id) VALUES (?, ?, ?)",
      [model.id, model.purchaseId, model.ticketId]
    );

    return model;
  }

  async createMany(
    data: PurchaseTicketModel[],
    connection?: PoolConnection
  ): Promise<PurchaseTicketModel[]> {
    const db = connection ?? Database.getInstance();

    const params = data.reduce<(number | string)[]>(
      (acc, ticket) => [...acc, ticket.id, ticket.purchaseId, ticket.ticketId],
      []
    );

    const values = Array(data.length).fill("(?, ?, ?)").join(", ");

    await db.execute<ResultSetHeader>(
      `INSERT INTO purchase_tickets (id, purchase_id, ticket_id) VALUES ${values}`,
      params
    );

    return data;
  }

  async findById(id: number): Promise<PurchaseTicketModel | null> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM purchase_tickets WHERE id = ?",
      [id]
    );

    return rows.length
      ? PurchaseTicketModel.load({
        id: rows[0].id,
        purchaseId: rows[0].purchase_id,
        ticketId: rows[0].ticket_id
      })
      : null;
  }

  async findAll(): Promise<PurchaseTicketModel[]> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM purchase_tickets"
    );

    return rows.map(
      (row) => PurchaseTicketModel.load({
        id: row.id,
        purchaseId: row.purchase_id,
        ticketId: row.ticket_id
      })
    );
  }

  async update(model: PurchaseTicketModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE purchase_tickets SET purchase_id = ?, ticket_id = ? WHERE id = ?",
      [model.purchaseId, model.ticketId, model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Purchase ticket not found");
    }
  }

  async delete(model: PurchaseTicketModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM purchase_tickets WHERE id = ?",
      [model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Purchase ticket not found");
    }
  }
}