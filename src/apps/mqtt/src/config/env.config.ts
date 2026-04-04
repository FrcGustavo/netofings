import Debug from 'debug';

const debug = Debug('netofings:mqtt:nest:db');

export default () => ({
  mqtt: {
    port: Number(process.env.MQTT_PORT || 1883),
  },
  db: {
    database: process.env.DB_NAME || 'netofings',
    username: process.env.DB_USER || 'gusi',
    password: process.env.DB_PASS || '123456',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: (s: string) => debug(s),
  },
});
