import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { postgresConfig } from './config/postgres.config';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { TagsModule } from './tags/tags.module';
import { EmailsModule } from './emails/emails.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    ArticlesModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: postgresConfig,
      inject: [ConfigService],
    }),
    FilesModule,
    AuthModule,
    TagsModule,
    EmailsModule,
    UsersModule,
  ],
})
export class AppModule {}
