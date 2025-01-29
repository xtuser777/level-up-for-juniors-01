import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { EventModel } from "../models/event-model";
import { Database } from "../database";

export class EventsRepository {
  async create(model: EventModel, connection?: PoolConnection): Promise<EventModel> {
    const db = connection ?? Database.getInstance();

    await db.execute<ResultSetHeader>(
      "INSERT INTO events (id, name, description, date, location, created_at, partner_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        model.id,
        model.name,
        model.description,
        model.date,
        model.location,
        model.createdAt,
        model.partnerId,
      ]
    );

    return model;
  }

  async update(model: EventModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE events SET name = ?, description = ?, date = ?, location = ?, partner_id = ? WHERE id = ?",
      [
        model.name,
        model.description,
        model.date,
        model.location,
        model.partnerId,
        model.id,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error("Event not found");
    }
  }

  async delete(model: EventModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM events WHERE id = ?",
      [model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Event not found");
    }
  }

  async findById(id: string): Promise<EventModel | null> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM events WHERE id = ?",
      [id]
    );

    return rows.length ? EventModel.load({
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description,
      date: rows[0].date,
      location: rows[0].location,
      partnerId: rows[0].partner_id,
      createdAt: rows[0].created_at,
    }) : null;
  }

  async findAll(filter?: { where?: { partner_id?: string }; }): Promise<EventModel[]> {
    const db = Database.getInstance();

    let query = "SELECT * FROM events";

    const params = [];
    if (filter && filter.where) {
      if (filter.where.partner_id) {
        query += " WHERE partner_id = ?";
        params.push(filter.where.partner_id);
      }
    }

    const [rows] = await db.execute<RowDataPacket[]>(query, params);

    return rows.map((row) => EventModel.load({
      id: row.id,
      name: row.name,
      description: row.description,
      date: row.date,
      location: row.location,
      partnerId: row.partner_id,
      createdAt: row.created_at,
    }));
  }
}