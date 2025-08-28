import { FastifyInstance } from 'fastify';
import neo4j from 'neo4j-driver';
import { parseSqlToLineage } from '../lineage/parser';

export async function registerLineageRoutes(app: FastifyInstance) {
  app.post('/lineage/parse', async (request, reply) => {
    const body = request.body as { sql: string; downstream?: string; persist?: boolean };
    if (!body?.sql) return reply.status(400).send({ error: 'sql required' });

    const result = parseSqlToLineage(body.sql);

    if (body.persist && body.downstream) {
      const driver = neo4j.driver(
        process.env.NEO4J_URI || 'bolt://neo4j:7687',
        neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'lineage123')
      );
      const session = driver.session();
      try {
        for (const upstream of result.upstreamAssets) {
          await session.run(
            'MERGE (u:DataAsset {id: $upstream}) MERGE (d:DataAsset {id: $downstream}) MERGE (u)-[:FLOWS_TO]->(d)',
            { upstream, downstream: body.downstream }
          );
        }
      } finally {
        await session.close();
        await driver.close();
      }
    }

    return { upstreamAssets: result.upstreamAssets };
  });
} 