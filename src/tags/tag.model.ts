import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Article } from '../articles/article.model';

@Entity('tags')
export class Tag {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({ type: String })
  @Column({ unique: true })
  public name: string;

  @ManyToMany(() => Article, (article) => article.tags)
  public articles: Article[];
}
