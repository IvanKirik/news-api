import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.model';
import { TagsModule } from '../tags/tags.module';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), TagsModule, EmailsModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
