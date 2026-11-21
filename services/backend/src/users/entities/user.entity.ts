import {
  Column,
  Entity,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Agent } from '../../agents/entities/agent.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  avatar?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Agent, (agent: Agent) => agent.user)
  agents!: Agent[];
}
