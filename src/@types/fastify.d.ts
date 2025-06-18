import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user: { //tipagem para o middleware
      id: string
    }
  }
}