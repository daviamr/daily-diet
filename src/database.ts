import { knex as SetupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE
  },
  migrations: {
    directory: './migrations'
  }
}

export const knex = SetupKnex(config)