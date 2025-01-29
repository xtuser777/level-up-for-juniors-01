type PurchaseProps = Omit<PurchaseModel, 'update'>;
type CreatePurchaseProps = Omit<PurchaseProps, 'id' | ''>;
type UpdatePurchaseProps = Partial<Omit<PurchaseProps, 'id' | ''>>;

export enum PurchaseStatus {
  pending = "pending",
  paid = "paid",
  error = "error",
  cancelled = "cancelled",
}

export class PurchaseModel {
  id: string;
  customerId: string;
  purchaseDate: Date;
  totalAmount: number;
  status: PurchaseStatus;

  private constructor(data: PurchaseProps) {
    Object.assign(this, data);
  }

  static create(props: CreatePurchaseProps): PurchaseModel {
    const purchaseDate = new Date();

    const purchase = new PurchaseModel({
      ...props,
      purchaseDate,
      id: crypto.randomUUID(),
    });
    return purchase;
  }

  static load(props: PurchaseProps): PurchaseModel {
    const purchase = new PurchaseModel({ ...props });

    return purchase;
  }

  update(props: UpdatePurchaseProps): void {
    if (props.customerId !== undefined) this.customerId = props.customerId;
    if (props.purchaseDate !== undefined) this.purchaseDate = props.purchaseDate;
    if (props.totalAmount !== undefined) this.totalAmount = props.totalAmount;
    if (props.status !== undefined) this.status = props.status;
  }
}
