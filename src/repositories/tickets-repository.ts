import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { TicketModel } from "../models/ticket-model";
import { Database } from "../database";

export class TicketsRepository {
  async create(model: TicketModel, connection?: PoolConnection): Promise<TicketModel> {
    const db = connection ?? Database.getInstance();
    
    await db.execute<ResultSetHeader>(
      "INSERT INTO tickets (id, location, event_id, price, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [model.id, model.location, model.eventId, model.price, model.status, model.createdAt]
    );

    return model;
  }
  
  async createMany(model: TicketModel[], connection?: PoolConnection): Promise<TicketModel[]> {
    const db = connection ?? Database.getInstance();

    const values = Array(model.length).fill("(?, ?, ?, ?, ?, ?)").join(", ");

    const params = model.reduce<(string | number | Date)[]>(
      (acc, ticket) => [
        ...acc,
        ticket.id,
        ticket.location,
        ticket.eventId,
        ticket.price,
        ticket.status,
        ticket.createdAt,
      ],
      []
    );

    await db.execute<ResultSetHeader>(
      `INSERT INTO tickets (id, location, event_id, price, status, created_at) VALUES ${values}`,
      params
    );

    return model;
  }
  
  async update(model: TicketModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE tickets SET location = ?, event_id = ?, price = ?, status = ? WHERE id = ?",
      [model.location, model.eventId, model.price, model.status, model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Ticket not found");
    }
  }
  
  async delete(model: TicketModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM tickets WHERE id = ?",
      [model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Ticket not found");
    }
  }

  async findById(id: string): Promise<TicketModel | null> {
    const db = Database.getInstance();
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM tickets WHERE id = ?",
      [id]
    );
    return rows.length ? TicketModel.load({
      id: rows[0].id,
      status: rows[0].status,
      location: rows[0].location,
      price: rows[0].price,
      eventId: rows[0].event_id,
      createdAt: rows[0].created_at,
    }) : null;
  }

  async findAll(
    filter?: { where?: { event_id?: string; ids?: string[] }; }, 
    options?: { connection?: PoolConnection }
  ): Promise<TicketModel[]> {
    const db = options?.connection ?? Database.getInstance();

    let query = "SELECT * FROM tickets";

    const params = [];

    if (filter && filter.where) {
      const where = [];
      if (filter.where.event_id) {
        where.push("event_id = ?");
        params.push(filter.where.event_id);
      }
      if (filter.where.ids) {
        //using ? and params
        where.push(`id IN (${filter.where.ids.map(() => "?").join(", ")})`);
        params.push(...filter.where.ids);
      }
      query += ` WHERE ${where.join(" AND ")}`;
    }

    const [rows] = await db.execute<RowDataPacket[]>(query, params);

    return rows.map((row) => TicketModel.load({
      id: row.id,
      status: row.status,
      location: row.location,
      price: row.price,
      eventId: row.event_id,
      createdAt: row.created_at,
    }));
  }
}