import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

export const postgresConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: await configService.get('DB_HOST'),
  port: await configService.get('DB_PORT'),
  username: await configService.get('POSTGRES_USER'),
  password: await configService.get('POSTGRES_PASSWORD'),
  database: await configService.get('POSTGRES_DB'),
  synchronize: true,
  entities: ['dist/**/*.model{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
});
