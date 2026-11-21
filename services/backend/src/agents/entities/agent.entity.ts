import { Metric } from '../../metrics/entities/metric.entity';
import { User } from '../../users/entities/user.entity';
import { AgentToken } from '../../tokens/entities/agent-token.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('agents')
export class Agent {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  username!: string;

  /**
   * NOTA: El campo 'name' queda obsoleto y solo existe por compatibilidad.
   * Usar únicamente 'username' en la lógica y la UI.
   */
  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 200 })
  hostname!: string;

  @Column({ type: 'int' })
  pid!: number;

  @Column({ type: 'boolean', default: false })
  connected!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Metric, (metric: Metric) => metric.agent)
  metrics!: Metric[];

  @OneToMany(() => AgentToken, (token) => token.agent)
  tokens!: AgentToken[];

  @ManyToOne(() => User, (user: User) => user.agents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user!: User;
}
