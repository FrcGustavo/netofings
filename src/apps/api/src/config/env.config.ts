import Debug from 'debug';

const debug = Debug('netofings:api:nest:db');

export default () => ({
  port: Number(process.env.PORT || 3001),
  db: {
    database: process.env.DB_NAME || 'netofings',
    username: process.env.DB_USER || 'gusi',
    password: process.env.DB_PASS || '123456',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: (s: string) => debug(s),
  },
  auth: {
    secret: process.env.AUTH_SECRET || process.env.SECRET || 'platzi',
    algorithms: (process.env.AUTH_ALGORITHMS || 'HS256')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  },
});
