import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

console.log('isTest', isTest);
console.log('isProd', isProd);
console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);

let dataSourceOptions: DataSourceOptions;

const isCompiled = __filename.endsWith('.js');
const migrationExt = isCompiled ? 'js' : 'ts';

if (isTest) {
  dataSourceOptions = {
    type: 'sqlite',
    database: 'test.sqlite',
    entities: [User, Report],
    migrations: [`migrations/*.${migrationExt}`],
    migrationsRun: true,
    synchronize: false,
  } as DataSourceOptions;
} else if (isProd) {
  dataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Report],
    migrations: [`prod-migrations/*.${migrationExt}`],
    migrationsRun: true,
    synchronize: false,
  } as DataSourceOptions;
} else {
  // development
  dataSourceOptions = {
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User, Report],
    migrations: [`migrations/*.${migrationExt}`],
    synchronize: false,
  } as DataSourceOptions;
}

export const AppDataSource = new DataSource(dataSourceOptions);
