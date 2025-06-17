import { FastifyInstance } from "fastify";
import { z, ZodError } from 'zod';
import { knex } from "../database";
import { CheckSessionId } from "../middlewares/check-session-id";

export async function dietRoutes(app: FastifyInstance) {

  app.post('/create', { preHandler: [CheckSessionId] }, async (request, reply) => {
    const mealSchema = z.object({
      name: z.string().nonempty('O campo nome é obrigatório.'),
      description: z.string().min(6, 'A descrição deve ter no mínimo 6 caracteres.'),
      on_diet: z.boolean()
    })

    try {
      const { ...data } = mealSchema.parse(request.body)

      const user_id = request.user.id

      if (!user_id) {
        return reply.status(401).send({
          statusCode: 401,
          message: 'Não autorizado. Token de usuário não encontrado.'
        })
      }

      await knex('meal').insert({
        id: user_id,
        ...data
      })

      return reply.status(201).send({
        statusCode: 201,
        message: 'Refeição cadastrada com sucesso.'
      })

    } catch (error) {

      if (error instanceof ZodError) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'Erro ao cadastrar a refeição.',
          issues: error.issues
        })
      }

    }

    return reply.status(500).send({
      statusCode: 500,
      message: 'Erro interno ao processar a requisição.'
    })

  })

}