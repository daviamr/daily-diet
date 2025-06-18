import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { CheckSessionId } from "../middlewares/check-session-id";

export async function metricRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [CheckSessionId] }, async (request, reply) => {
    try {
      const user_id = request.user.id

      const meals = await knex('meal').where({ user_id }).orderBy('created_at').select()

      if (!meals) {
        return reply.status(400).send({
          statusCode: 400,
          message: 'Você não tem nenhuma refeição cadastrada.'
        })
      }

      let best_sequence = 0
      let actual_sequence = 0

      for (const meal of meals) {
        if (meal.on_diet >= 1) {
          actual_sequence++
          if (actual_sequence > best_sequence) {
            best_sequence = actual_sequence // salva a melhor sequência
          }
        } else {
          actual_sequence = 0 // quebra a sequência caso tenha alguma refeição fora da dieta
        }
      }

      return reply.status(200).send({
        statusCode: 200,
        message: 'Métricas retornadas com sucesso.',
        metrics: {
          total_meal: meals.length,
          on_diet: meals.filter(meal => meal.on_diet >= 1).length,
          out_diet: meals.filter(meal => meal.on_diet <= 0).length,
          best_sequence_on_diet: best_sequence
        }
      })
    } catch (error) {
      return reply.status(400).send({
        statusCode: 400,
        message: 'Erro ao fazer a busca.',
        issues: error
      })
    }
  })
}