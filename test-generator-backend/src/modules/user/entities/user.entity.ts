import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { UserRole } from './user.role.entity';

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 255 })
  role!: string;

  @ManyToOne(() => UserRole, (role) => role.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role_id: UserRole;
}