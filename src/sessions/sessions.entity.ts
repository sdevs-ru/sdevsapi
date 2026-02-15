import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('sessions')
export class Session {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => User, u => u.sessions)
  user: User;

  @Column()
  refreshTokenHash: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  revoked: boolean;
}
