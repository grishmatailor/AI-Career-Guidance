import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("ai_recommendations")
export class AIRecommendation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column()
  title!: string;

  @Column("text")
  explanation!: string;

  @Column("simple-array")
  requiredSkills!: string[];

  @Column()
  salaryRange!: string;

  @Column("simple-array")
  roadmap!: string[];

  @CreateDateColumn()
  created_at!: Date;
}
