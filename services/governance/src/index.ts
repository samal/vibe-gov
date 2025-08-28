import Fastify from 'fastify';
import { registerAuthRoutes } from './routes/auth.js';
import { registerClassificationRoutes } from './routes/classifications.js';
import { registerMaskingRoutes } from './routes/masking.js';
import { registerAuditRoutes } from './routes/audit.js';

const app = Fastify({ 
  logger: true,
  trustProxy: true, // Trust proxy for IP address detection
});

// Health check endpoint
app.get('/health', async () => ({ status: 'ok' }));

// Register all route modules
app.register(registerAuthRoutes, { prefix: '/api/v1' });
app.register(registerClassificationRoutes, { prefix: '/api/v1' });
app.register(registerMaskingRoutes, { prefix: '/api/v1' });
app.register(registerAuditRoutes, { prefix: '/api/v1' });

// Error handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation Error',
      details: error.validation,
    });
  }
  
  return reply.status(500).send({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3004;

app
  .listen({ port, host: '0.0.0.0' })
  .then(() => app.log.info(`governance service listening on ${port}`))
  .catch((err: unknown) => {
    app.log.error(err);
    process.exit(1);
  }); 