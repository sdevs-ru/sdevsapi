import { Role } from 'src/roles/roles.entity';
import { Session } from 'src/sessions/sessions.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Session, (s) => s.user)
  sessions: Session[];
}
