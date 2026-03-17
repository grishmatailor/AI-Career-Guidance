import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Question } from "./Question";

@Entity("answers")
export class Answer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.answers)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({ name: "question_id" })
  question!: Question;

  @Column()
  answer!: string;
}
