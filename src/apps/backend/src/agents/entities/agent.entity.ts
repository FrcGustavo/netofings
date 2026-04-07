import { Metric } from '../../metrics/entities/metric.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('agents')
export class Agent {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  uuid!: string;

  @Column({ type: 'varchar', length: 120 })
  username!: string;

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

  @ManyToOne(() => User, (user: User) => user.agents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user!: User;
}
