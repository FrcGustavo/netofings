import { Agent } from '../../agents/entities/agent.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('metrics')
export class Metric {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id!: string;

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
