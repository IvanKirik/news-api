import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { Article } from '../articles/article.model';
import { UserModel } from '../auth/user.model';

export const postgresConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: await configService.get('DB_HOST'),
  port: await configService.get('DB_PORT'),
  username: await configService.get('DB_USERNAME'),
  password: await configService.get('DB_PASSWORD'),
  database: await configService.get('DB_NAME'),
  entities: [Article, UserModel],
  synchronize: true,
});
