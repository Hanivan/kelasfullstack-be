import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users', database: 'kelasfullstack' })
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: BigInt;

  @Column()
  title: string;

  @Column()
  name: string;

  @Column({ length: 2500 })
  bio: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  remember_token: string;

  @Column({ type: 'tinyint' })
  n_status: number;

  @Column({ type: 'timestamp' })
  last_login: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
