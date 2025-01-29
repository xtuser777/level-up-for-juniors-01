type TicketProps = Omit<TicketModel, 'update'>;
type CreateTicketProps = Omit<TicketProps, 'id' | 'createdAt'>;
type UpdateTicketProps = Partial<Omit<TicketProps, 'id' | 'createdAt'>>;

export enum TicketStatus {
  available = "available",
  sold = "sold",
}

export class TicketModel {
  id: string;
  location: string;
  eventId: string;
  price: number;
  status: TicketStatus;
  createdAt: Date;

  private constructor(data: Partial<TicketModel> = {}) {
    Object.assign(this, data);
  }

  static create(props: CreateTicketProps): TicketModel {
    const createdAt = new Date();
    
    const ticket = new TicketModel({
      ...props,
      createdAt,
      id: crypto.randomUUID(),
    });

    return ticket;
  }

  static load(props: TicketProps): TicketModel {
    const ticket = new TicketModel({ ...props });

    return ticket;
  }

  update(props: UpdateTicketProps): void {
    if (props.location !== undefined) this.location = props.location;
    if (props.eventId !== undefined) this.eventId = props.eventId;
    if (props.price !== undefined) this.price = props.price;
    if (props.status !== undefined) this.status = props.status;
  }
}
