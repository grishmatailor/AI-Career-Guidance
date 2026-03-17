import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Answer } from "./Answer";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  question!: string;

  @Column()
  category!: string; // interests, skills, personality, education

  @OneToMany(() => Answer, (answer) => answer.question)
  answers!: Answer[];
}
