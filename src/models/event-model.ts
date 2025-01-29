type EventProps = Omit<EventModel, 'update'>;
type CreateEventProps = Omit<EventProps, 'id' | 'createdAt'>;
type UpdateEventProps = Partial<Omit<EventProps, 'id' | 'createdAt'>>;

export class EventModel {
  id: string;
  name: string;
  description: string | null;
  date: Date;
  location: string;
  partnerId: string;
  createdAt: Date;

  private constructor(data: EventProps) {
    Object.assign(this, data);
  }

  static create(props: CreateEventProps): EventModel {
    const createdAt = new Date();
    
    const event = new EventModel({
      ...props,
      createdAt,
      id: crypto.randomUUID(),
    });
    return event;
  }

  static load(props: EventProps): EventModel {
    const event = new EventModel({ ...props });

    return event;
  }

  update(props: UpdateEventProps): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.description !== undefined) this.description = props.description;
    if (props.date !== undefined) this.date = props.date;
    if (props.location !== undefined) this.location = props.location;
    if (props.partnerId !== undefined) this.partnerId = props.partnerId;
  }
}
