import { useQuery } from '@tanstack/react-query';
import { Database, GitBranch, Shield, Activity } from 'lucide-react';
import { mockAPI, governanceAPI } from '../lib/api';
import { AssetCard } from '../components/AssetCard';
import { DataAsset } from '../types';

export function Dashboard() {
  const { data: assets = [] } = useQuery<DataAsset[]>({
    queryKey: ['assets'],
    queryFn: mockAPI.getAssets,
  });

  const { data: auditSummary } = useQuery({
    queryKey: ['audit-summary'],
    queryFn: () => governanceAPI.getAuditSummary(),
  });

  const stats = [
    {
      name: 'Total Assets',
      value: assets.length,
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Lineage Connections',
      value: assets.length * 2, // Mock calculation
      icon: GitBranch,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Governance Policies',
      value: 5, // Mock value
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Recent Activity',
      value: auditSummary?.totalEvents || 0,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your data governance and lineage platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Assets */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Data Assets</h2>
          <a href="/catalog" className="text-sm text-primary-600 hover:text-primary-700">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.slice(0, 6).map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {auditSummary && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Actions</h3>
            <div className="space-y-3">
              {Object.entries(auditSummary.actionBreakdown).map(([action, count]) => (
                <div key={action} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{action.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Entity Activity</h3>
            <div className="space-y-3">
              {Object.entries(auditSummary.entityBreakdown).map(([entity, count]) => (
                <div key={entity} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{entity || 'Unknown'}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
