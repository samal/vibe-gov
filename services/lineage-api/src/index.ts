import Fastify from 'fastify';
import { registerLineageRoutes } from './routes/lineage.js';

const app = Fastify({ logger: true });

app.get('/health', async () => ({ status: 'ok' }));

await registerLineageRoutes(app);

const port = process.env.PORT ? Number(process.env.PORT) : 3003;
app
  .listen({ port, host: '0.0.0.0' })
  .then(() => app.log.info(`lineage-api listening on ${port}`))
  .catch((err: unknown) => {
    app.log.error(err);
    process.exit(1);
  }); 