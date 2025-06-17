import {knex as SetupKnex, Knex} from 'knex'

export const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'daily-diet'
  },
  migrations: {
    directory: './migrations'
  }
}

export const knex = SetupKnex(config)