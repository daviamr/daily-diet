import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../database";

export async function CheckSessionId(request: FastifyRequest, reply: FastifyReply) {

  const sessionId = request.cookies.session_id // session_id nome do cookie definido na rota /auth

  if (!sessionId) {
    return reply.status(401).send({
      statusCode: 401,
      message: 'Não autorizado, usuário não autenticado.'
    })
  }

  const session = await knex('sessions').where({ 'session_id': sessionId }).first()

  if (!session) {
    return reply.status(401).send({
      statusCode: 401,
      message: 'Não autorizado, sessão inválida.'
    })
  }

  request.user = { id: session.user_id }

}