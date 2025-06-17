import { FastifyInstance } from "fastify";
import { z, ZodError } from 'zod';
import { knex } from "../database";
import { CheckSessionId } from "../middlewares/check-session-id";
import { randomUUID } from "crypto";

export async function dietRoutes(app: FastifyInstance) {

  app.post('/create', { preHandler: [CheckSessionId] }, async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string().nonempty('O campo nome é obrigatório.'),
      description: z.string().min(6, 'A descrição deve ter no mínimo 6 caracteres.'),
      on_diet: z.boolean()
    })

    try {
      const { ...data } = createMealSchema.parse(request.body)

      const user_id = request.user.id

      if (!user_id) {
        return reply.status(401).send({
          statusCode: 401,
          message: 'Não autorizado. Token de usuário não encontrado.'
        })
      }

      await knex('meal').insert({
        id: randomUUID(),
        user_id: user_id,
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

  app.put('/edit', { preHandler: [CheckSessionId] }, async (request, reply) => {
    const { meal_id } = request.query as { meal_id: string }

    const editMealSchema = z.object({
      name: z.string().nonempty('O campo nome é obrigatório.'),
      description: z.string().min(6, 'A descrição deve ter no mínimo 6 caracteres.'),
      on_diet: z.boolean()
    })

    try {
      const { ...data } = editMealSchema.parse(request.body)

      if (!meal_id) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'Id da refeição não encontrado.'
        })
      }

      const meal = await knex('meal').where({ id: meal_id }).first()

      const user_id = request.user.id

      if (!meal) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'Refeição não encontrada no banco de dados.'
        })
      }

      // trativa caso a refeição não seja do usuário que fez a request
      if (meal.user_id != user_id) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'Você só pode editar suas próprias refeições.'
        })
      }

      await knex('meal').where({ id: meal_id }).update({ ...data })

      return reply.status(200).send({
        statusCode: 200,
        message: 'Refeição editada com sucesso.'
      })

    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'Erro ao editar a refeição.'
        })
      }
    }

    return reply.status(500).send({
      statusCode: 500,
      message: 'Erro interno ao processar a requisição.'
    })
  })

  app.delete('/remove', { preHandler: [CheckSessionId] }, async (request, reply) => {
    const { meal_id } = request.query as { meal_id: string }

    try {
      if (!meal_id) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'Id da refeição não encontrado.'
        })
      }

      const meal = await knex('meal').where({ id: meal_id }).first()

      if (!meal) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'Refeição não encontrada no banco de dados.'
        })
      }

      const user_id = request.user.id

      // trativa caso a refeição não seja do usuário que fez a request
      if (meal.user_id != user_id) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'Você só pode excluir suas próprias refeições.'
        })
      }

      await knex('meal').where({ id: meal_id }).delete()

      return reply.status(200).send({
        statusCode: 200,
        message: 'Refeição excluída com sucesso.'
      })

    } catch (error) {

      if (error instanceof ZodError) {
        return reply.status(500).send({
          statusCode: 500,
          message: 'Erro ao deletar a refeição.',
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