import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Answer } from "./Answer";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "user" })
  role!: string;

  @Column({ nullable: true })
  education?: string;

  @Column({ default: 0 })
  assessmentCount!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Answer, (answer) => answer.user)
  answers!: Answer[];
}
