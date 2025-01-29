import { TicketModel, TicketStatus } from "../models/ticket-model";
import { EventsRepository } from "../repositories/events-repository";
import { TicketsRepository } from "../repositories/tickets-repository";

export class TicketService {
  private eventsRepository: EventsRepository;
  private ticketsRepository: TicketsRepository;

  constructor() {
    this.eventsRepository = new EventsRepository();
    this.ticketsRepository = new TicketsRepository();
  }

  async createMany(data: {
    eventId: string;
    numTickets: number;
    price: number;
  }) {
    const event = await this.eventsRepository.findById(data.eventId);

    if (!event) {
      throw new Error("Event not Found");
    }

    const ticketsData = Array(data.numTickets)
      .fill({})
      .map((_, index) => TicketModel.create({
        location: `Location ${index}`,
        eventId: event.id,
        price: data.price,
        status: TicketStatus.available,
      }));

    await this.ticketsRepository.createMany(ticketsData);
  }

  async findByEventId(eventId: string) {
    const event = await this.eventsRepository.findById(eventId);

    if (!event) {
      throw new Error("Event not Found");
    }

    return this.ticketsRepository.findAll({ where: { event_id: eventId } });
  }

  async findById(eventId: string, ticketId: string) {
    const ticket = await this.ticketsRepository.findById(ticketId);
    return ticket && ticket.eventId === eventId ? ticket : null;
  }
}
