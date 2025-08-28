import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => ({ status: 'ok' }));

const port = process.env.PORT ? Number(process.env.PORT) : 3004;
app
  .listen({ port, host: '0.0.0.0' })
  .then(() => app.log.info(`governance listening on ${port}`))
  .catch((err: unknown) => {
    app.log.error(err);
    process.exit(1);
  }); 