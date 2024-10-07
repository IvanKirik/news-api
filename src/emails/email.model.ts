import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../articles/article.model';

@Entity('emails')
export class Email {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column()
  email: string;

  @ManyToMany(() => Article, (article) => article.emailsToSend)
  public articles: Article[];
}
