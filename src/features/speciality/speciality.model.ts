import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../users/user.model';

@Entity('speciality')
export class Speciality {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({ type: String })
  @Column({ unique: true })
  public name: string;

  @ManyToMany(() => UserModel, (user) => user)
  public users: Speciality[];

  @ApiProperty({ type: String })
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @ApiProperty({ type: String })
  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
