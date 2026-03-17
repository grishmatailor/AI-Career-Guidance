import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Recommendation } from "./Recommendation";

@Entity("careers")
export class Career {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column("simple-array")
  skills_required!: string[];

  @Column()
  salary_range!: string;

  @Column()
  growth_rate!: string;

  @OneToMany(() => Recommendation, (recommendation) => recommendation.career)
  recommendations!: Recommendation[];
}
