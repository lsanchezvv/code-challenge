import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const loadPgDbConfig = (): TypeOrmModuleOptions => {
  const configService = new ConfigService();
  const dbHost = configService.get('DB_HOST');
  const dbPort = configService.get('DB_PORT');
  const dbUser = configService.get('DATABASE_USER');
  const dbPassword = configService.get('DATABASE_PASSWORD');
  const dbName = configService.get('DATABASE_NAME');

  if (!dbHost || !dbPort || !dbUser || !dbPassword || !dbName)
    throw new Error('Failed to load db credentials');

  return {
    type: 'postgres',
    host: dbHost,
    port: parseInt(dbPort) || 5432,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // should enable migrations for prod
  };
};
