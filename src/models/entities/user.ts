import * as bcrypt from "bcrypt";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable} from "typeorm";
import * as path from "path";

import { Logger } from "../../util/logger";
import { Group } from "./group";
import { IUser } from "./IUser";

const logger = Logger(path.normalize(path.basename(__filename)));

export interface IUserCredentials {
  username: string;
  password: string;
}

@Entity()
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ "type": "varchar" })
  public firstName!: string;

  @Column({ "type": "varchar" })
  public lastName!: string;

  @Column({ "type": "varchar" })
  public email!: string;

  @Column({ "type": "varchar" })
  public username!: string;

  @Column({ "type": "varchar" })
  public passwordHash!: string;

  @ManyToMany((type) => Group, (group: Group) => group.users)
  public groups!: Group[];

  // @OneToMany((type) => Group, (group: Group) => group.owner)
  // public ownedGroups!: Group[];

  @ManyToMany((type) => User)
  @JoinTable()
  public contacts!: IUser[];

  public verifyPassword = async (password: string) => {
    return await bcrypt.compare(password, this.passwordHash);
  }

  public updatePassword = async (password: string) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    this.passwordHash = hash;
  }

}
