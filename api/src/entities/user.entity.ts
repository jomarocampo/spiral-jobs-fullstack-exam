import {Entity,  PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  jwt_secret: string;

  @Column({ nullable: true })
  last_login: Date;

  @Column()
  is_deleted: boolean;

  ////////////////////////////////
  // Metadata Fields
  ////////////////////////////////

  @Column({ nullable: true })
  created_by: String;

  @Column({ nullable: true })
  created_date: Date;

  @Column({ nullable: true })
  modified_by: String;

  @Column({ nullable: true })
  modified_date: Date;

}
