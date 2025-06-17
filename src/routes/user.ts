import { FastifyInstance } from "fastify";
import { z, ZodError } from 'zod'
import { knex } from '../database'
import { randomUUID } from "crypto";

export async function userRoutes(app: FastifyInstance) {

  // create user
  app.post('/create', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string().min(4, 'É necessário ter no mínimo 4 caracteres.'),
      login: z.string().min(4, 'O login deve ter no mínimo 4 caracteres.'),
      pass: z.string().min(4, 'A senha deve ter no mínimo 4 caracteres.')
    })

    try {
      const { ...data } = createUserSchema.parse(request.body)

      await knex('user').insert({
        id: randomUUID(),
        ...data
      })

      return reply.status(201).send({
        statusCode: 201,
        message: 'Usuário cadastrado com sucesso.'
      })

    } catch (error) {

      if (error instanceof ZodError) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'O cadastro do usuário falhou.',
          issues: error.issues
        })
      }

    }

    return reply.status(500).send({
      statusCode: 500,
      message: 'Erro interno ao processar a requisição.'
    })

  })

  // login
  app.post('/auth', async (request, reply) => {
    const authSchema = z.object({
      login: z.string().min(4, 'O login deve ter no mínimo 4 caracteres.'),
      pass: z.string().min(4, 'A senha deve ter no mínimo 4 caracteres.')
    })

    try {
      const { login, pass } = authSchema.parse(request.body)

      const user = await knex('user').where({ login, pass }).first()

      if (!user) {
        return reply.status(404).send({
          statusCode: 404,
          message: 'Usuário não encontrado, verifique as credenciais.'
        })
      }

      const sessionId = randomUUID()

      await knex('sessions').insert({
        session_id: sessionId,
        user_id: user.id
      })

      reply.setCookie('session_id', sessionId, {
        path: '/', // define em quais rotas o cookie será enviado pelo navegador ('/' = todas)
        httpOnly: true, // impede que o cookie seja acessado via JS no navegador
        secure: false, // o cookie só será enviado via HTTPS (true em produção)
        sameSite: 'lax', // lax em desenvolvimento
        maxAge: 60 * 60 * 24 // 1 dia
      })

      return reply.status(200).send({
        statusCode: 200,
        message: 'Autenticado com sucesso.'
      })

    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'A autenticação falhou.',
          issues: error.issues
        })
      }
    }

    return reply.status(500).send({
      statusCode: 500,
      message: 'Erro interno ao processar a requisição.',
    })

  })
}