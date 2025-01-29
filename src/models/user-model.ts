import bcrypt from "bcrypt";

export type UserProps = Omit<UserModel, 'update'>;
export type CreateUserProps = Omit<UserProps, 'id' | 'createdAt'>;
export type UpdateUserProps = Partial<Omit<UserProps, 'id' | 'createdAt'>>;

export class UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;

  private constructor(data: UserProps) {
    Object.assign(this, data);
  }

  static create(props: CreateUserProps): UserModel {
    const createdAt = new Date();
    const hashedPassword = UserModel.hashPassword(props.password);
    const user = new UserModel({
      ...props,
      password: hashedPassword,
      createdAt,
      id: crypto.randomUUID(),
    });

    return user;
  }

  static load(props: UserProps): UserModel {
    const user = new UserModel({
      ...props,
    });

    return user;
  }

  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  update(props: UpdateUserProps): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.email !== undefined) this.email = props.email;
    if (props.password !== undefined) this.password = props.password;
  }
}
