import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}
