import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Database } from 'lucide-react';
import { assetsAPI, governanceAPI } from '../lib/api';
import { AssetCard } from '../components/AssetCard';
import { DataAsset, DataClassification } from '../types';
import { getClassificationColor } from '../lib/utils';

export function DataCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassifications, setSelectedClassifications] = useState<string[]>([]);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<string[]>([]);

  const { data: assets = [], isLoading } = useQuery<DataAsset[]>({
    queryKey: ['assets'],
    queryFn: assetsAPI.getAssets,
  });

  const { data: classifications = [] } = useQuery<DataClassification[]>({
    queryKey: ['classifications'],
    queryFn: governanceAPI.getClassifications,
  });

  // Filter assets based on search and filters
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.namespace.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.sourceSystem.toLowerCase().includes(searchTerm.toLowerCase());

      // Classification filter
      const matchesClassification = selectedClassifications.length === 0 ||
        asset.schema?.columns?.some(col => 
          col.classification && selectedClassifications.includes(col.classification)
        );

      // Asset type filter
      const matchesAssetType = selectedAssetTypes.length === 0 ||
        selectedAssetTypes.includes(asset.assetType);

      return matchesSearch && matchesClassification && matchesAssetType;
    });
  }, [assets, searchTerm, selectedClassifications, selectedAssetTypes]);

  // Get unique asset types
  const assetTypes = useMemo(() => {
    const types = new Set(assets.map(asset => asset.assetType));
    return Array.from(types);
  }, [assets]);

  const handleClassificationChange = (classification: string) => {
    setSelectedClassifications(prev => 
      prev.includes(classification)
        ? prev.filter(c => c !== classification)
        : [...prev, classification]
    );
  };

  const handleAssetTypeChange = (assetType: string) => {
    setSelectedAssetTypes(prev => 
      prev.includes(assetType)
        ? prev.filter(t => t !== assetType)
        : [...prev, assetType]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClassifications([]);
    setSelectedAssetTypes([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Catalog</h1>
        <p className="text-gray-600">Discover and explore your data assets</p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filters</span>
            {(selectedClassifications.length > 0 || selectedAssetTypes.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter Options */}
        <div className="mt-4 space-y-4">
          {/* Asset Types */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Asset Types</h4>
            <div className="flex flex-wrap gap-2">
              {assetTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleAssetTypeChange(type)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${
                    selectedAssetTypes.includes(type)
                      ? 'bg-primary-100 text-primary-700 border-primary-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Classifications */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Classifications</h4>
            <div className="flex flex-wrap gap-2">
              {classifications.map((classification) => (
                <button
                  key={classification.key}
                  onClick={() => handleClassificationChange(classification.key)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${
                    selectedClassifications.includes(classification.key)
                      ? `${getClassificationColor(classification.key)} border-current`
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {classification.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {filteredAssets.length} of {assets.length} assets
          </span>
        </div>
      </div>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
