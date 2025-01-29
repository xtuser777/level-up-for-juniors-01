import { PurchaseModel, PurchaseStatus } from "../models/purchase-model";
import { TicketModel, TicketStatus } from "../models/ticket-model";
import { PurchaseTicketModel } from "../models/purchase-ticket-model";
import { PaymentService } from "./payment-service";
import {
  ReservationStatus,
  ReservationTicketModel,
} from "../models/reservation-ticket-model";
import { Database } from "../database";
import { CustomersRepository } from "../repositories/customers-repository";
import { TicketsRepository } from "../repositories/tickets-repository";
import { PurchasesRepository } from "../repositories/purchases-repository";
import { ReservationsTicketsRepository } from "../repositories/reservations-tickets-repository";
import { PurchasesTicketsRepository } from "../repositories/purchases-tickets-repository";

export class PurchaseService {
  private paymentService: PaymentService;
  private customersRepository: CustomersRepository;
  private ticketsRepository: TicketsRepository;
  private purchasesRepository: PurchasesRepository;
  private reservationsTicketsRepository: ReservationsTicketsRepository;
  private purchasesTicketsRepository: PurchasesTicketsRepository;

  constructor() {
    this.customersRepository = new CustomersRepository();
    this.ticketsRepository = new TicketsRepository();
    this.purchasesRepository = new PurchasesRepository();
    this.reservationsTicketsRepository = new ReservationsTicketsRepository();
    this.purchasesTicketsRepository = new PurchasesTicketsRepository();
  }

  async create(data: {
    customerId: string;
    ticketIds: string[];
    cardToken: string;
  }): Promise<string> {

    const customer = await this.customersRepository.findById(data.customerId, {
      user: true, //eager loading
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const tickets = await this.ticketsRepository.findAll({
      where: { ids: data.ticketIds },
    });

    if (tickets.length !== data.ticketIds.length) {
      throw new Error("Some tickets not found");
    }

    if (tickets.some((t) => t.status !== TicketStatus.available)) {
      throw new Error("Some tickets are not available");
    }

    const amount = tickets.reduce((total, ticket) => total + ticket.price, 0);

    const db = Database.getInstance();
    const connection = await db.getConnection();

    let purchase: PurchaseModel; 
    try {
      await connection.beginTransaction();

      purchase = PurchaseModel.create(
        {
          customerId: data.customerId,
          totalAmount: amount,
          purchaseDate: new Date(),
          status: PurchaseStatus.pending,
        }
      );

      await this.purchasesRepository.create(purchase, connection);

      await this.associateTicketsWithPurchase(
        purchase.id,
        data.ticketIds,
        connection
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    try {
      await connection.beginTransaction();

      purchase.update({ status: PurchaseStatus.paid});
      await this.purchasesRepository.update(purchase, connection);

      const reservationTicket = ReservationTicketModel.create(
        {
          customerId: data.customerId,
          ticketId: data.ticketIds[0],
          reservationDate: new Date(),
          status: ReservationStatus.reserved,
        }
      );

      await this.reservationsTicketsRepository.create(reservationTicket, connection)

      await this.paymentService.processPayment(
        {
          name: customer.user!.name,
          email: customer.user!.email,
          address: customer.address,
          phone: customer.phone,
        },
        purchase!.totalAmount,
        data.cardToken
      );

      await connection.commit();
      return purchase.id;
    } catch (error) {
      await connection.rollback();
      purchase.update({ status: PurchaseStatus.error });
      await this.purchasesRepository.update(purchase, connection);
      throw error;
    } finally {
      connection.release();
    }
  }

  private async associateTicketsWithPurchase(
    purchaseId: string,
    ticketIds: string[],
    connection: any
  ): Promise<void> {
    const purchaseTickets = ticketIds.map((ticketId) => PurchaseTicketModel.create({
      purchaseId: purchaseId,
      ticketId: ticketId,
    }));
    await this.purchasesTicketsRepository.createMany(purchaseTickets, connection);
  }

  async findById(id: number): Promise<PurchaseModel | null> {
    return this.purchasesRepository.findById(id);
  }
}
