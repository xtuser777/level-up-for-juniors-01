import { EventModel } from "../models/event-model";
import { EventsRepository } from "../repositories/events-repository";

export class EventService {
  private eventsRepository: EventsRepository;
  
  constructor() {
    this.eventsRepository = new EventsRepository();
  }

  async create(data: {
    name: string;
    description: string | null;
    date: Date;
    location: string;
    partnerId: string;
  }) {
    const { name, description, date, location, partnerId } = data;

    const event = EventModel.create({
      name,
      description,
      date,
      location,
      partnerId: partnerId,
    });

    await this.eventsRepository.create(event);

    return {
      id: event.id,
      name,
      description,
      date,
      location,
      createdAt: event.createdAt,
      partnerId: partnerId,
    };
  }

  async findAll(partnerId?: string) {
    return this.eventsRepository.findAll({
      where: { partner_id: partnerId },
    });
  }

  async findById(eventId: string) {
    return this.eventsRepository.findById(eventId);
  }
}
