type ReservationTicketProps = Omit<ReservationTicketModel, 'update'>;
type CreateReservationTicketProps = Omit<ReservationTicketProps, 'id'>;
type UpdateReservationTicketProps = Omit<ReservationTicketProps, 'id'>;

export enum ReservationStatus {
  reserved = "reserved",
  cancelled = "cancelled",
}

export class ReservationTicketModel {
  id: string;
  customerId: string;
  ticketId: string;
  reservationDate: Date;
  status: ReservationStatus;

  private constructor(data: ReservationTicketProps) {
    Object.assign(this, data);
  }

  static create(props: CreateReservationTicketProps): ReservationTicketModel {
    const reservationDate = new Date();
    
    const reservation = new ReservationTicketModel({
      ...props,
      reservationDate,
      id: crypto.randomUUID(),
    });

    return reservation;
  }

  static load(props: ReservationTicketProps): ReservationTicketModel {
    const reservation = new ReservationTicketModel({
      ...props,
    });

    return reservation;
  }

  update(props: UpdateReservationTicketProps): void {
    if (props.customerId !== undefined) this.customerId = props.customerId;
    if (props.ticketId !== undefined) this.ticketId = props.ticketId;
    if (props.reservationDate !== undefined) this.reservationDate = props.reservationDate;
    if (props.status !== undefined) this.status = props.status;
  }
}
