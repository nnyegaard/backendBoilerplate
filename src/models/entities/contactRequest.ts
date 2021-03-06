import * as bcrypt from "bcrypt";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";

import {Logger} from "../../util/logger";
import {User} from "./user";
import {IContactRequest} from "./IContactRequest";

@Entity()
export class ContactRequest extends BaseEntity implements IContactRequest {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne((type) => User, (user: User) => user.id)
  public fromUserId!: number;

  @ManyToOne((type) => User, (user: User) => user.id)
  public toUserId!: number;

}
