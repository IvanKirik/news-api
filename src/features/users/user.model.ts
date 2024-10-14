import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Speciality } from '../speciality/speciality.model';

@Entity('users')
export class UserModel {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  refreshToken: string;

  @ApiProperty({ type: () => [Speciality] })
  @ManyToMany(() => Speciality, (speciality) => speciality.users, {
    cascade: true,
  })
  @JoinTable()
  speciality: Speciality[];

  @ApiProperty({ type: String })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
