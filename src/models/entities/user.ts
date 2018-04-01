import * as bcrypt from "bcrypt";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToMany, OneToOne, JoinColumn} from "typeorm";
import * as path from "path";

import { Logger } from "../../util/logger";
import { Group } from "./group";
import { Resume } from "./resume";

const logger = Logger(path.normalize(path.basename(__filename)));

export abstract class IUser {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  username!: string;
  public verifyPassword!: (password: string) => Promise<boolean>;
  public updatePassword!: (password: string) => Promise<void>;
}

export interface IUserCredentials {
  username: string;
  password: string;
}

export interface IUserSerialized extends IUserCredentials {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Entity()
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToOne(type => Resume)
  @JoinColumn()
  public resume?: Resume;

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

  @OneToMany((type) => Group, (group: Group) => group.owner)
  public ownedGroups!: Group[];

  @ManyToMany((type) => User, (user: User) => user.id)
  public contacts!: User[];

  public verifyPassword = async (password: string) => {
    logger.info("in user verify password: ", password, password.length, this.passwordHash, this.passwordHash.length)
    var result = await bcrypt.compare(password, this.passwordHash);
    logger.info("password compare result = "+ result)
    return result;
  }

  public updatePassword = async (password: string) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    logger.debug("bcrypt hash obtained ", hash.length, password.length);
    this.passwordHash = hash;
  }

}
