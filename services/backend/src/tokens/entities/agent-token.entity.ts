import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Agent } from '../../agents/entities/agent.entity';

@Entity('agent_tokens')
export class AgentToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  token!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @ManyToOne(() => Agent, (agent) => agent.tokens, { onDelete: 'CASCADE' })
  agent!: Agent;

  @Column({ type: 'boolean', default: false })
  revoked!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
