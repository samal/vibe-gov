import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { LineageGraphProps, LineageNode } from '../types';

// Register the dagre layout
cytoscape.use(dagre);

export function LineageGraph({ data, onNodeClick, onNodeHover }: LineageGraphProps) {
  const cyRef = useRef<HTMLDivElement>(null);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<LineageNode | null>(null);

  useEffect(() => {
    if (!cyRef.current || !data) return;

    // Create cytoscape instance
    const cyInstance = cytoscape({
      container: cyRef.current,
      elements: {
        nodes: data.nodes.map(node => ({
          data: {
            id: node.id,
            label: node.name,
            type: node.type,
            namespace: node.namespace,
            sourceSystem: node.sourceSystem,
          },
          classes: `node-${node.type.toLowerCase()}`,
        })),
        edges: data.edges.map(edge => ({
          data: {
            id: `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            type: edge.type,
          },
          classes: 'edge-lineage',
        })),
      },
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#3b82f6',
            'border-color': '#1d4ed8',
            'border-width': 2,
            'color': '#ffffff',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '120px',
            'font-size': 12,
            'font-weight': 500,
            'width': 80,
            'height': 80,
            'shape': 'ellipse',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#1d4ed8',
            'border-color': '#1e40af',
            'border-width': 3,
          },
        },
        {
          selector: 'node.node-table',
          style: {
            'background-color': '#3b82f6',
          },
        },
        {
          selector: 'node.node-view',
          style: {
            'background-color': '#10b981',
          },
        },
        {
          selector: 'node.node-column',
          style: {
            'background-color': '#8b5cf6',
            'width': 60,
            'height': 60,
          },
        },
        {
          selector: 'node.node-report',
          style: {
            'background-color': '#f59e0b',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#6b7280',
            'target-arrow-color': '#6b7280',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1,
          },
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#1d4ed8',
            'target-arrow-color': '#1d4ed8',
            'width': 3,
          },
        },
      ],
      layout: {
        name: 'dagre',
        nodeSep: 50,
        edgeSep: 20,
        rankSep: 80,
        padding: 50,
      } as any,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: true,
      autoungrabify: false,
      autolock: false,
    });

    // Event listeners
    cyInstance.on('tap', 'node', (evt) => {
      const node = evt.target;
      const nodeData = node.data();
      const selectedNodeData: LineageNode = {
        id: nodeData.id,
        name: nodeData.label,
        type: nodeData.type,
        namespace: nodeData.namespace,
        sourceSystem: nodeData.sourceSystem,
      };
      setSelectedNode(selectedNodeData);
      onNodeClick?.(selectedNodeData);
    });

    cyInstance.on('mouseover', 'node', (evt) => {
      const node = evt.target;
      const nodeData = node.data();
      const hoveredNode: LineageNode = {
        id: nodeData.id,
        name: nodeData.label,
        type: nodeData.type,
        namespace: nodeData.namespace,
        sourceSystem: nodeData.sourceSystem,
      };
      onNodeHover?.(hoveredNode);
    });

    cyInstance.on('mouseout', 'node', () => {
      onNodeHover?.(null);
    });

    setCy(cyInstance);

    return () => {
      cyInstance.destroy();
    };
  }, [data, onNodeClick, onNodeHover]);

  useEffect(() => {
    if (cy) {
      cy.layout({ name: 'dagre' }).run();
    }
  }, [cy, data]);

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-lg border border-gray-200">
      <div ref={cyRef} className="w-full h-full" />
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
          <h3 className="font-semibold text-gray-900 mb-2">{selectedNode.name}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Type:</span> {selectedNode.type}</p>
            <p><span className="font-medium">Namespace:</span> {selectedNode.namespace}</p>
            <p><span className="font-medium">Source:</span> {selectedNode.sourceSystem}</p>
          </div>
        </div>
      )}
    </div>
  );
}
