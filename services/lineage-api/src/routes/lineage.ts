import { FastifyInstance } from 'fastify';
import neo4j from 'neo4j-driver';
import { parseSqlToLineage } from '../lineage/parser.js';

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

  app.get('/lineage/graph', async (request, reply) => {
    const { assetId } = request.query as { assetId?: string };
    
    const driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://neo4j:7687',
      neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'lineage123')
    );
    const session = driver.session();
    
    try {
      let query: string;
      let params: any = {};
      
      if (assetId) {
        // Get lineage for specific asset
        query = `
          MATCH (n:DataAsset {id: $assetId})
          OPTIONAL MATCH (upstream:DataAsset)-[:FLOWS_TO]->(n)
          OPTIONAL MATCH (n)-[:FLOWS_TO]->(downstream:DataAsset)
          RETURN DISTINCT n, upstream, downstream
        `;
        params = { assetId };
      } else {
        // Get all lineage data
        query = `
          MATCH (n:DataAsset)
          OPTIONAL MATCH (upstream:DataAsset)-[:FLOWS_TO]->(n)
          OPTIONAL MATCH (n)-[:FLOWS_TO]->(downstream:DataAsset)
          RETURN DISTINCT n, upstream, downstream
          LIMIT 100
        `;
      }
      
      const result = await session.run(query, params);
      
      const nodes = new Map();
      const edgesSet = new Set();
      const edges: any[] = [];
      
      result.records.forEach(record => {
        const mainNode = record.get('n');
        const upstreamNode = record.get('upstream');
        const downstreamNode = record.get('downstream');
        
        if (mainNode) {
          nodes.set(mainNode.properties.id, {
            id: mainNode.properties.id,
            name: mainNode.properties.name || mainNode.properties.id,
            type: mainNode.properties.type || 'TABLE',
            namespace: mainNode.properties.namespace || 'public',
            sourceSystem: mainNode.properties.sourceSystem || 'unknown'
          });
        }
        
        if (upstreamNode) {
          nodes.set(upstreamNode.properties.id, {
            id: upstreamNode.properties.id,
            name: upstreamNode.properties.name || upstreamNode.properties.id,
            type: upstreamNode.properties.type || 'TABLE',
            namespace: upstreamNode.properties.namespace || 'public',
            sourceSystem: upstreamNode.properties.sourceSystem || 'unknown'
          });
          
          if (mainNode) {
            const edgeKey = `${upstreamNode.properties.id}->${mainNode.properties.id}`;
            if (!edgesSet.has(edgeKey)) {
              edgesSet.add(edgeKey);
              edges.push({
                source: upstreamNode.properties.id,
                target: mainNode.properties.id,
                type: 'FLOWS_TO'
              });
            }
          }
        }
        
        if (downstreamNode) {
          nodes.set(downstreamNode.properties.id, {
            id: downstreamNode.properties.id,
            name: downstreamNode.properties.name || downstreamNode.properties.id,
            type: downstreamNode.properties.type || 'TABLE',
            namespace: downstreamNode.properties.namespace || 'public',
            sourceSystem: downstreamNode.properties.sourceSystem || 'unknown'
          });
          
          if (mainNode) {
            const edgeKey = `${mainNode.properties.id}->${downstreamNode.properties.id}`;
            if (!edgesSet.has(edgeKey)) {
              edgesSet.add(edgeKey);
              edges.push({
                source: mainNode.properties.id,
                target: downstreamNode.properties.id,
                type: 'FLOWS_TO'
              });
            }
          }
        }
      });
      
      return {
        nodes: Array.from(nodes.values()),
        edges: edges
      };
      
    } catch (error) {
      console.error('Error fetching lineage graph:', error);
      return reply.status(500).send({ error: 'Failed to fetch lineage graph' });
    } finally {
      await session.close();
      await driver.close();
    }
  });
} 