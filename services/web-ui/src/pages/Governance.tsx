import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Shield, 
  Eye, 
  Plus, 
  Edit, 
  Trash2, 
  Activity, 
  FileText,
  Database
} from 'lucide-react';
import { governanceAPI } from '../lib/api';
import { DataClassification, MaskingRule, AuditEvent } from '../types';

type TabType = 'classifications' | 'masking' | 'audit';

export function Governance() {
  const [activeTab, setActiveTab] = useState<TabType>('classifications');
  const [showCreateClassification, setShowCreateClassification] = useState(false);
  const [showCreateMaskingRule, setShowCreateMaskingRule] = useState(false);
  const queryClient = useQueryClient();

  // Queries
  const { data: classifications = [], isLoading: classificationsLoading } = useQuery<DataClassification[]>({
    queryKey: ['classifications'],
    queryFn: governanceAPI.getClassifications,
  });

  const { data: maskingRules = [], isLoading: maskingRulesLoading } = useQuery<MaskingRule[]>({
    queryKey: ['maskingRules'],
    queryFn: governanceAPI.getMaskingRules,
  });

  const { data: auditSummary } = useQuery({
    queryKey: ['auditSummary'],
    queryFn: () => governanceAPI.getAuditSummary(),
  });

  const { data: auditEvents = [], isLoading: auditLoading } = useQuery<AuditEvent[]>({
    queryKey: ['auditEvents'],
    queryFn: () => governanceAPI.getAuditEvents({ limit: 50 }),
  });

  // Mutations
  const createClassificationMutation = useMutation({
    mutationFn: governanceAPI.createClassification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classifications'] });
      setShowCreateClassification(false);
    },
  });

  const createMaskingRuleMutation = useMutation({
    mutationFn: governanceAPI.createMaskingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maskingRules'] });
      setShowCreateMaskingRule(false);
    },
  });

  const tabs = [
    { id: 'classifications' as TabType, label: 'Data Classifications', icon: Shield },
    { id: 'masking' as TabType, label: 'Masking Rules', icon: Eye },
    { id: 'audit' as TabType, label: 'Audit Logs', icon: Activity },
  ];

  const getClassificationColor = (key: string) => {
    const colors: Record<string, string> = {
      PII: 'bg-red-100 text-red-800 border-red-200',
      PHI: 'bg-orange-100 text-orange-800 border-orange-200',
      FINANCIAL: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIDENTIAL: 'bg-purple-100 text-purple-800 border-purple-200',
      PUBLIC: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[key] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getMaskingTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      REDACT: 'bg-red-100 text-red-800',
      HASH: 'bg-blue-100 text-blue-800',
      PARTIAL: 'bg-yellow-100 text-yellow-800',
      CUSTOM: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Governance</h1>
        <p className="text-gray-600">Manage data classifications, masking rules, and audit logs</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Classifications</p>
              <p className="text-lg font-semibold text-gray-900">{classifications.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Masking Rules</p>
              <p className="text-lg font-semibold text-gray-900">{maskingRules.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Audit Events</p>
              <p className="text-lg font-semibold text-gray-900">{auditSummary?.totalEvents || 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Assets</p>
              <p className="text-lg font-semibold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Classifications Tab */}
        {activeTab === 'classifications' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Data Classifications</h2>
              <button
                onClick={() => setShowCreateClassification(true)}
                className="btn btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Classification
              </button>
            </div>

            {classificationsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading classifications...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classifications.map((classification) => (
                  <div key={classification.id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{classification.label}</h3>
                        <p className="text-sm text-gray-500">{classification.key}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getClassificationColor(classification.key)}`}>
                        {classification.key}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create Classification Modal */}
            {showCreateClassification && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Create Classification</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createClassificationMutation.mutate({
                      key: formData.get('key') as string,
                      label: formData.get('label') as string,
                    });
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
                        <input
                          type="text"
                          name="key"
                          required
                          className="input w-full"
                          placeholder="e.g., SENSITIVE"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input
                          type="text"
                          name="label"
                          required
                          className="input w-full"
                          placeholder="e.g., Sensitive Data"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowCreateClassification(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createClassificationMutation.isPending}
                        className="btn btn-primary"
                      >
                        {createClassificationMutation.isPending ? 'Creating...' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Masking Rules Tab */}
        {activeTab === 'masking' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Data Masking Rules</h2>
              <button
                onClick={() => setShowCreateMaskingRule(true)}
                className="btn btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Masking Rule
              </button>
            </div>

            {maskingRulesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading masking rules...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {maskingRules.map((rule) => (
                  <div key={rule.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{rule.name}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Classification: {rule.classificationKey}</span>
                          <span>Role ID: {rule.roleId}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMaskingTypeColor(rule.maskingType)}`}>
                            {rule.maskingType}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          rule.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {rule.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create Masking Rule Modal */}
            {showCreateMaskingRule && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Create Masking Rule</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createMaskingRuleMutation.mutate({
                      name: formData.get('name') as string,
                      classificationKey: formData.get('classificationKey') as string,
                      roleId: parseInt(formData.get('roleId') as string),
                      maskingType: formData.get('maskingType') as 'REDACT' | 'HASH' | 'PARTIAL' | 'CUSTOM',
                      maskingConfig: {},
                      enabled: true,
                    });
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="input w-full"
                          placeholder="e.g., PII Redaction for Viewers"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Classification</label>
                        <select name="classificationKey" required className="input w-full">
                          <option value="">Select classification</option>
                          {classifications.map((c) => (
                            <option key={c.key} value={c.key}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role ID</label>
                        <input
                          type="number"
                          name="roleId"
                          required
                          className="input w-full"
                          placeholder="e.g., 4"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Masking Type</label>
                        <select name="maskingType" required className="input w-full">
                          <option value="">Select type</option>
                          <option value="REDACT">Redact</option>
                          <option value="HASH">Hash</option>
                          <option value="PARTIAL">Partial</option>
                          <option value="CUSTOM">Custom</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowCreateMaskingRule(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createMaskingRuleMutation.isPending}
                        className="btn btn-primary"
                      >
                        {createMaskingRuleMutation.isPending ? 'Creating...' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Audit Logs</h2>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Last 50 events</span>
              </div>
            </div>

            {auditLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading audit logs...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {auditEvents.map((event) => (
                  <div key={event.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{event.action}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{event.entityType}</span>
                          {event.entityId && (
                            <>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">ID: {event.entityId}</span>
                            </>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          Actor: User {event.actorUserId} • {new Date(event.createdAt).toLocaleString()}
                        </div>
                        {event.metadata && (
                          <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(event.metadata, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          event.action.includes('CREATE') ? 'bg-green-100 text-green-800' :
                          event.action.includes('UPDATE') ? 'bg-blue-100 text-blue-800' :
                          event.action.includes('DELETE') ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.action}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
