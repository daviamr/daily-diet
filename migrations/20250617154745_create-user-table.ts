import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('login').notNullable()
    table.text('pass').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user')
}

