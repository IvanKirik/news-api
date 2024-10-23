import { Module } from '@nestjs/common';
import { ArticlesModule } from './features/articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { postgresConfig } from './config/postgres.config';
import { FilesModule } from './features/files/files.module';
import { AuthModule } from './features/auth/auth.module';
import { TagsModule } from './features/tags/tags.module';
import { EmailsModule } from './features/emails/emails.module';
import { UsersModule } from './features/users/users.module';
import { SpecialityModule } from './features/speciality/speciality.module';

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
    SpecialityModule,
  ],
})
export class AppModule {}
