import { describe, test, expect, afterAll, beforeAll, beforeEach } from "vitest";
import request from 'supertest'
import { app } from "../app";
import { execSync } from "node:child_process";

describe('tests diet routes', () => {
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

  test('user can create a meal', async () => {

    await request(app.server).post('/user/create').send({
      name: 'Teste Conta',
      login: 'teste2',
      pass: 'teste3'
    })

    const auth = await request(app.server).post('/user/auth').send({
      login: 'teste2',
      pass: 'teste3'
    })

    const cookie = auth.get('Set-Cookie')

    if (!cookie) {
      throw new Error('Cookie não encontrado.')
    }

    const createMeal = await request(app.server).post('/diet/create')
      .set('Cookie', cookie)
      .send({
        name: 'teste comida',
        description: 'descrição teste',
        on_diet: true
      }).expect(201)

    expect(createMeal.body).toEqual({
      statusCode: 201,
      message: 'Refeição cadastrada com sucesso.'
    })

  })

  test('user can edit a meal', async () => {
    await request(app.server).post('/user/create').send({
      name: 'Teste Conta',
      login: 'teste2',
      pass: 'teste3'
    })

    const auth = await request(app.server).post('/user/auth').send({
      login: 'teste2',
      pass: 'teste3'
    })

    const cookie = auth.get('Set-Cookie')

    if (!cookie) {
      throw new Error('Cookie não encontrado.')
    }

    await request(app.server).post('/diet/create')
      .set('Cookie', cookie)
      .send({
        name: 'teste comida',
        description: 'descrição teste',
        on_diet: true
      }).expect(201)

    const meals = await request(app.server).get('/diet/list').set('Cookie', cookie).expect(200)

    const mealId = meals.body.list[0].id

    const editMeal = await request(app.server).put(`/diet/edit?meal_id=${mealId}`)
      .set('Cookie', cookie)
      .send({
        name: 'teste edição comida',
        description: 'edição descrição teste',
        on_diet: false
      }).expect(200)

    expect(editMeal.body).toEqual({
      statusCode: 200,
      message: 'Refeição editada com sucesso.'
    })

  })

})