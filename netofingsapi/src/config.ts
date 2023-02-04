import Debug from 'debug';

const debug = Debug('netofings:api:db');

const config = {
  db: {
    database: process.env.DB_NAME || 'netofings',
    username: process.env.DB_USER || 'gusi',
    password: process.env.DB_PASS || '123456',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: (s: string) => debug(s),
  },
  auth: {
    secret: process.env.SECRET || 'platzi',
    algorithms: ['RS256'],
  },
};

export default config;
