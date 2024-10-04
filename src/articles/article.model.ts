import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('articles')
export class Article {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column()
  title: string;

  @ApiProperty({ type: String })
  @Column()
  description: string;

  @ApiProperty({ type: String })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ type: String })
  @Column()
  email: string;

  @ApiProperty({ type: Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
