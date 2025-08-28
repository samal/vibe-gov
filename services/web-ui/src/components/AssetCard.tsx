import { Database, Calendar, User } from 'lucide-react';
import { AssetCardProps } from '../types';
import { formatDate, getAssetTypeColor, getClassificationColor, truncateText } from '../lib/utils';

export function AssetCard({ asset, onSelect }: AssetCardProps) {
  const handleClick = () => {
    onSelect?.(asset);
  };

  return (
    <div 
      className="card hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="font-semibold text-gray-900">{asset.name}</h3>
            <p className="text-sm text-gray-500">{asset.namespace}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAssetTypeColor(asset.assetType)}`}>
          {asset.assetType}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Source:</span>
          <span>{asset.sourceSystem}</span>
        </div>

        {asset.schema?.columns && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Columns ({asset.schema.columns.length})</h4>
            <div className="space-y-1">
              {asset.schema.columns.slice(0, 3).map((column, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{column.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">{column.dataType}</span>
                    {column.classification && (
                      <span className={`px-1 py-0.5 rounded text-xs ${getClassificationColor(column.classification)}`}>
                        {column.classification}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {asset.schema.columns.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{asset.schema.columns.length - 3} more columns
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(asset.updatedAt)}</span>
          </div>
          {asset.owners && asset.owners.length > 0 && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{truncateText(asset.owners[0], 15)}</span>
              {asset.owners.length > 1 && (
                <span className="text-xs text-gray-500">+{asset.owners.length - 1}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
