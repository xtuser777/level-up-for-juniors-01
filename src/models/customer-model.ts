import { UserModel } from "./user-model";

type CustomerProps = Omit<CustomerModel, 'update'>;
type CreateCustomerProps = Omit<CustomerProps, 'id' | 'createdAt'>;
type UpdateCustomerProps = Partial<Omit<CustomerProps, 'id' | 'createdAt'>>;

export class CustomerModel {
  id: string;
  userId: string;
  address: string;
  phone: string;
  createdAt: Date;
  user?: UserModel;

  private constructor(data: CustomerProps) {
    Object.assign(this, data);
  }

  static create(props: CreateCustomerProps): CustomerModel {
    const createdAt = new Date();
    
    const customer = new CustomerModel({
      ...props,
      createdAt,
      id: crypto.randomUUID(),
    });

    return customer;
  }

  static load(props: CustomerProps): CustomerModel {
    const customer = new CustomerModel({
      ...props,
    });

    return customer;
  }

  update(props: UpdateCustomerProps): void {
    if (props.userId !== undefined) this.userId = props.userId;
    if (props.address !== undefined) this.address = props.address;
    if (props.phone !== undefined) this.phone = props.phone;
  }
}
