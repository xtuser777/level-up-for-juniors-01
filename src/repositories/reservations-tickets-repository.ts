import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Database } from "../database";
import { ReservationTicketModel } from "../models/reservation-ticket-model";

export class ReservationsTicketsRepository {
  async create(model: ReservationTicketModel, connection?: PoolConnection): Promise<ReservationTicketModel> {
    const db = connection ?? Database.getInstance();
    
    await db.execute<ResultSetHeader>(
      "INSERT INTO reservation_tickets (id, customer_id, ticket_id, status, reservation_date) VALUES (?, ?, ?, ?, ?)",
      [model.id, model.customerId, model.ticketId, model.status, model.reservationDate]
    );

    return model;
  }

  async findById(id: number): Promise<ReservationTicketModel | null> {
    const db = Database.getInstance();
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM reservation_tickets WHERE id = ?",
      [id]
    );
    return rows.length
      ? ReservationTicketModel.load({
        id: rows[0].id,
        status: rows[0].status,
        customerId: rows[0].customer_id,
        ticketId: rows[0].ticket_id,
        reservationDate: rows[0].reservation_date,
      })
      : null;
  }

  async findAll(): Promise<ReservationTicketModel[]> {
    const db = Database.getInstance();

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM reservation_tickets"
    );

    return rows.map(
      (row) => ReservationTicketModel.load({
        id: row.id,
        status: row.status,
        customerId: row.customer_id,
        ticketId: row.ticket_id,
        reservationDate: row.reservation_date,
      })
    );
  }

  async update(model: ReservationTicketModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE reservation_tickets SET customer_id = ?, ticket_id = ?, status = ? WHERE id = ?",
      [model.customerId, model.ticketId, model.status, model.id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Reservation not found");
    }
  }

  async delete(model: ReservationTicketModel, connection?: PoolConnection): Promise<void> {
    const db = connection ?? Database.getInstance();

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM reservation_tickets WHERE id = ?",
      [model.id]
    );
    
    if (result.affectedRows === 0) {
      throw new Error("Reservation not found");
    }
  }
}