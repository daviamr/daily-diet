import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sessions', (table) => {
    table.uuid('session_id')
    table.uuid('user_id')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('sessions')
}

