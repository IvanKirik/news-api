import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { postgresConfig } from './config/postgres.config';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';

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
  ],
})
export class AppModule {}
