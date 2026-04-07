import { Agent } from '../../agents/entities/agent.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('metrics')
export class Metric {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  type!: string;

  @Column({ type: 'text' })
  value!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Agent, (agent: Agent) => agent.metrics, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  agent!: Agent;
}
