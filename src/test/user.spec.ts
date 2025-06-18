import { test, describe, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest';
import { app } from "../app";
import { execSync } from 'node:child_process';

describe('test user routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('user can create a account', async () => {

    const createUser = await request(app.server).post('/user/create').send({
      name: 'teste',
      login: 'teste2',
      pass: 'teste3'
    }).expect(201)

    expect(createUser.body).toEqual({
      statusCode: 201,
      message: 'Usuário cadastrado com sucesso.',
    })

  })

  test('user can authenticate', async () => {

    const createUser = await request(app.server).post('/user/auth').send({
      login: 'teste2',
      pass: 'teste3'
    }).expect(200)

    expect(createUser.body).toEqual({
      statusCode: 200,
      message: 'Autenticado com sucesso.',
    })

  })
})