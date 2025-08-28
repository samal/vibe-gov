import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => ({ status: 'ok' }));

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app
  .listen({ port, host: '0.0.0.0' })
  .then(() => app.log.info(`connectors listening on ${port}`))
  .catch((err: unknown) => {
    app.log.error(err);
    process.exit(1);
  }); 