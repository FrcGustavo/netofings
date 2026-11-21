import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      port: process.env.POSTGRES_PORT,
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      dbName: process.env.POSTGRES_DB,
    },
    jwtSecret: process.env.JWT_SECRET,
  };
});
