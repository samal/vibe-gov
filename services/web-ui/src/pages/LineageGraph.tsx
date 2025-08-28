import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play } from 'lucide-react';
import { LineageGraph as LineageGraphComponent } from '../components/LineageGraph';
import { lineageAPI, mockAPI } from '../lib/api';
import { LineageGraph, DataAsset } from '../types';

export function LineageGraphPage() {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('pg.public.users');
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [parsedAssets, setParsedAssets] = useState<string[]>([]);

  const { data: assets = [] } = useQuery<DataAsset[]>({
    queryKey: ['assets'],
    queryFn: mockAPI.getAssets,
  });

  const { data: lineageData, isLoading } = useQuery<LineageGraph>({
    queryKey: ['lineage', selectedAssetId],
    queryFn: () => lineageAPI.getLineageGraph(selectedAssetId),
    enabled: !!selectedAssetId,
  });

  const handleAssetSelect = (assetId: string) => {
    setSelectedAssetId(assetId);
  };

  const handleParseSQL = async () => {
    if (!sqlQuery.trim()) return;

    try {
      const result = await lineageAPI.parseLineage(sqlQuery, selectedAssetId, true);
      setParsedAssets(result.upstreamAssets);
    } catch (error) {
      console.error('Error parsing SQL:', error);
    }
  };

  const sampleQueries = [
    'SELECT u.name, o.amount FROM users u JOIN orders o ON u.id = o.user_id',
    'SELECT * FROM user_summary WHERE total_amount > 1000',
    'CREATE VIEW user_orders AS SELECT u.id, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lineage Graph</h1>
        <p className="text-gray-600">Visualize data lineage and dependencies</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Asset Selector */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Asset</h2>
          <div className="space-y-2">
            {assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => handleAssetSelect(asset.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedAssetId === asset.id
                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{asset.name}</div>
                <div className="text-sm text-gray-500">{asset.namespace}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SQL Parser */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SQL Lineage Parser</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SQL Query
              </label>
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Enter SQL query to parse lineage..."
                className="input h-32 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleParseSQL}
                disabled={!sqlQuery.trim()}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4" />
                Parse Lineage
              </button>
            </div>

            {parsedAssets.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Upstream Assets</h3>
                <div className="space-y-1">
                  {parsedAssets.map((asset, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {asset}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Queries</h3>
              <div className="space-y-2">
                {sampleQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setSqlQuery(query)}
                    className="block w-full text-left text-xs text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-50"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Graph Controls */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Graph Controls</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Tables</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Columns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Reports</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click on nodes to see details</li>
                <li>• Drag to pan around the graph</li>
                <li>• Use mouse wheel to zoom</li>
                <li>• Select an asset to view its lineage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lineage Graph */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Lineage Visualization</h2>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              Loading...
            </div>
          )}
        </div>
        
        {lineageData && (
          <div className="relative">
            <LineageGraphComponent
              data={lineageData}
              onNodeClick={(node) => {
                console.log('Selected node:', node);
              }}
              onNodeHover={(node) => {
                console.log('Hovered node:', node);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
