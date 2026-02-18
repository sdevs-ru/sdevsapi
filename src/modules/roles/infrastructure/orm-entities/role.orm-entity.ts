import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('roles')
export class RoleOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column({ default: false })
    isSystem: boolean;
}
