import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '../tags/tag.model';
import { Email } from '../emails/email.model';

@Entity('articles')
export class Article {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column()
  title: string;

  @ApiProperty({ type: String })
  @Column({ nullable: true })
  author: string;

  @ApiProperty({ type: String })
  @Column()
  description: string;

  @ApiProperty({ type: String })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ type: String })
  @Column({ name: 'email', nullable: true })
  emailIsAuthor: string;

  @ApiProperty({ type: String })
  @Column({ name: 'name_author', nullable: true })
  nameIsAuthor: string;

  @ApiProperty({ type: () => [Tag] })
  @ManyToMany(() => Tag, (tag) => tag.articles, {
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];

  @ApiProperty({ type: () => [Email] })
  @ManyToMany(() => Email, (email) => email.articles, {
    cascade: true,
  })
  @JoinTable()
  emailsToSend: Email[];

  @ApiProperty({ type: Date })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
