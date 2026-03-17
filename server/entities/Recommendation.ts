import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Career } from "./Career";

@Entity("recommendations")
export class Recommendation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.recommendations)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Career, (career) => career.recommendations)
  @JoinColumn({ name: "career_id" })
  career!: Career;

  @Column({ type: "float", default: 0 })
  score!: number;
}
