import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Funcionando')
})

const port = 3000
console.log(`Servidor en http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})