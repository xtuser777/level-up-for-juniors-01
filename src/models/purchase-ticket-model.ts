type PurchaseTicketProps = Omit<PurchaseTicketModel, 'update'>;
type CreatePurchaseTicketProps = Omit<PurchaseTicketProps, 'id'>;
type UpdatePurchaseTicketProps = Partial<Omit<PurchaseTicketProps, 'id'>>;

export class PurchaseTicketModel {
  id: string;
  purchaseId: string;
  ticketId: string;

  private constructor(data: PurchaseTicketProps) {
    Object.assign(this, data);
  }

  static create(props: CreatePurchaseTicketProps): PurchaseTicketModel {
    const purchaseTicket = new PurchaseTicketModel({
      ...props,
      id: crypto.randomUUID(),
    });

    return purchaseTicket;
  }

  static load(props: PurchaseTicketProps): PurchaseTicketModel {
    const purchaseTicket = new PurchaseTicketModel({ ...props });

    return purchaseTicket;
  }

  update(props: UpdatePurchaseTicketProps): void {
    this.purchaseId = props.purchaseId ?? '';
    this.ticketId = props.ticketId ?? '';
  }
}
