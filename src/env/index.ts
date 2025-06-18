import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
    override: true
  })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.string(),
  MYSQL_HOST: z.string(),
  MYSQL_PORT: z.coerce.number().default(3333),
  MYSQL_USER: z.string(),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Erro de variável de ambiente.', _env.error.format())
  throw new Error('Erro de variável de ambiente!');
}

export const env = _env.data