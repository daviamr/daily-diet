import { test, describe, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest';
import { app } from "../app";

describe('test user routes', () => {
  beforeAll(async () => { // antes de rodar os testes, aguarda o app estar pronto
    await app.ready()
  })

  afterAll(async () => { // após os testes, fechar a aplicação (remover da memória)
    await app.close()
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