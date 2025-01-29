import { UserModel } from "./user-model";

export type PartnerProps = Omit<PartnerModel, 'update'>;
export type CreatePartnerProps = Omit<PartnerProps, 'id' | 'createdAt'>;
export type UpdatePartnerProps = Partial<Omit<PartnerProps, 'id' | 'createdAt'>>;

export class PartnerModel {
  id: string;
  userId: string;
  companyName: string;
  createdAt: Date;
  user?: UserModel;

  private constructor(data: PartnerProps) {
    Object.assign(this, data);
  }

  static create(props: CreatePartnerProps): PartnerModel {
    const createdAt = new Date();

    const partner = new PartnerModel({
      ...props,
      createdAt,
      id: crypto.randomUUID(),
    });

    return partner;
  }

  static load(props: PartnerProps): PartnerModel {
    const partner = new PartnerModel({
      ...props
    });

    return partner;
  }

  update(props: UpdatePartnerProps): void {
    if (props.userId !== undefined) this.userId = props.userId;
    if (props.companyName !== undefined) this.companyName = props.companyName;
  }
}
