import fastify from 'fastify'
import { userRoutes } from './routes/user'
import cookie from '@fastify/cookie'
import { dietRoutes } from './routes/diet'

export const app = fastify()

app.addHook('preHandler', async (request) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(cookie, {
  hook: 'onRequest' // fastify vai parsear os cookies logo no início da requisição, antes dos handlers e hooks
})

app.register(userRoutes, {
  prefix: 'user'
})

app.register(dietRoutes, {
  prefix: 'diet'
})
