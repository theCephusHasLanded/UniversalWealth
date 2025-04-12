import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  NodeChange,
  EdgeChange,
  Connection,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PlusCircle, Trash2, Eye, FileText, BarChart3 } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

// Custom node types
import PersonNode from './tree/PersonNode';
import AssetNode from './tree/AssetNode';
import TrustNode from './tree/TrustNode';

// Types
interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthYear?: number;
  photoURL?: string;
  assets?: string[];
}

interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'real_estate' | 'investment' | 'cash' | 'business' | 'other';
  ownerId: string;
  transferDate?: string;
  beneficiaries?: string[];
}

interface FamilyWealthTreeProps {
  familyMembers?: FamilyMember[];
  assets?: Asset[];
  readOnly?: boolean;
  className?: string;
}

// Define custom node types
const nodeTypes = {
  person: PersonNode,
  asset: AssetNode,
  trust: TrustNode,
};

const initialNodes: Node[] = [
  {
    id: 'primary-1',
    data: { 
      label: 'Primary Member',
      role: 'primary',
      assets: 3,
      totalValue: 2500000
    },
    position: { x: 250, y: 100 },
    type: 'person',
  },
  {
    id: 'spouse-1',
    data: { 
      label: 'Spouse',
      role: 'spouse',
      assets: 1,
      totalValue: 1200000 
    },
    position: { x: 450, y: 100 },
    type: 'person',
  },
  {
    id: 'child-1',
    data: { 
      label: 'Child 1',
      role: 'child',
      assets: 0,
      totalValue: 0
    },
    position: { x: 150, y: 250 },
    type: 'person',
  },
  {
    id: 'child-2',
    data: {
      label: 'Child 2',
      role: 'child',
      assets: 0,
      totalValue: 0
    },
    position: { x: 350, y: 250 },
    type: 'person',
  },
  {
    id: 'trust-1',
    data: {
      label: 'Family Trust',
      type: 'revocable',
      assets: 2,
      totalValue: 1500000,
      beneficiaries: ['child-1', 'child-2']
    },
    position: { x: 550, y: 250 },
    type: 'trust',
  },
  {
    id: 'asset-1',
    data: {
      label: 'Primary Residence',
      type: 'real_estate',
      value: 1200000,
      ownerId: 'primary-1',
      planned: false,
    },
    position: { x: 150, y: 400 },
    type: 'asset',
  },
  {
    id: 'asset-2',
    data: {
      label: 'Investment Portfolio',
      type: 'investment',
      value: 800000,
      ownerId: 'trust-1',
      planned: true,
    },
    position: { x: 350, y: 400 },
    type: 'asset',
  },
  {
    id: 'asset-3',
    data: {
      label: 'Business Interest',
      type: 'business',
      value: 950000,
      ownerId: 'primary-1',
      planned: false,
    },
    position: { x: 550, y: 400 },
    type: 'asset',
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e-primary-spouse',
    source: 'primary-1',
    target: 'spouse-1',
    type: 'straight',
    animated: false,
    style: { stroke: '#CBA76E', strokeWidth: 2 },
  },
  {
    id: 'e-primary-child1',
    source: 'primary-1',
    target: 'child-1',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#CBA76E', strokeWidth: 1.5 },
  },
  {
    id: 'e-primary-child2',
    source: 'primary-1',
    target: 'child-2',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#CBA76E', strokeWidth: 1.5 },
  },
  {
    id: 'e-spouse-child1',
    source: 'spouse-1',
    target: 'child-1',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#CBA76E', strokeWidth: 1.5 },
  },
  {
    id: 'e-spouse-child2',
    source: 'spouse-1',
    target: 'child-2',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#CBA76E', strokeWidth: 1.5 },
  },
  {
    id: 'e-primary-trust',
    source: 'primary-1',
    target: 'trust-1',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6E56CF', strokeWidth: 2, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6E56CF' },
  },
  {
    id: 'e-trust-child1',
    source: 'trust-1',
    target: 'child-1',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6E56CF', strokeWidth: 1.5, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6E56CF' },
  },
  {
    id: 'e-trust-child2',
    source: 'trust-1',
    target: 'child-2',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#6E56CF', strokeWidth: 1.5, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6E56CF' },
  },
  {
    id: 'e-primary-asset1',
    source: 'primary-1',
    target: 'asset-1',
    type: 'straight',
    animated: false,
    style: { stroke: '#2D81FF', strokeWidth: 1.5 },
  },
  {
    id: 'e-primary-asset3',
    source: 'primary-1',
    target: 'asset-3',
    type: 'straight',
    animated: false,
    style: { stroke: '#2D81FF', strokeWidth: 1.5 },
  },
  {
    id: 'e-trust-asset2',
    source: 'trust-1',
    target: 'asset-2',
    type: 'straight',
    animated: false,
    style: { stroke: '#2D81FF', strokeWidth: 1.5 },
  },
];

const FamilyWealthTree: React.FC<FamilyWealthTreeProps> = ({
  familyMembers,
  assets,
  readOnly = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Set up state for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [viewMode, setViewMode] = useState<'default' | 'financial' | 'legal'>('default');
  
  // Handle connecting nodes
  const onConnect = useCallback((params: Connection) => {
    // Create different types of connections based on source and target node types
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);
    
    if (!sourceNode || !targetNode) return;
    
    let edgeStyle: Record<string, any> = { 
      stroke: '#CBA76E', 
      strokeWidth: 1.5 
    };
    
    // Person to Person connection
    if (sourceNode.type === 'person' && targetNode.type === 'person') {
      edgeStyle = { stroke: '#CBA76E', strokeWidth: 1.5 };
    }
    // Person to Trust connection
    else if ((sourceNode.type === 'person' && targetNode.type === 'trust') || 
             (sourceNode.type === 'trust' && targetNode.type === 'person')) {
      edgeStyle = { 
        stroke: '#6E56CF', 
        strokeWidth: 1.5, 
        strokeDasharray: '5,5' 
      };
    }
    // Person/Trust to Asset connection
    else if ((sourceNode.type === 'person' || sourceNode.type === 'trust') && 
              targetNode.type === 'asset') {
      edgeStyle = { stroke: '#2D81FF', strokeWidth: 1.5 };
    }
    
    const newEdge: Edge = {
      ...params,
      id: `e-${params.source}-${params.target}`,
      style: edgeStyle,
      type: 'smoothstep',
      animated: false,
    };
    
    setEdges(edges => [...edges, newEdge]);
  }, [nodes, setEdges]);
  
  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);
  
  // Add a new node
  const addNode = (type: 'person' | 'asset' | 'trust') => {
    const newNodeId = `${type}-${nodes.length + 1}`;
    const position = { x: 250, y: 400 };
    
    let newNode: Node;
    
    if (type === 'person') {
      newNode = {
        id: newNodeId,
        type: 'person',
        position,
        data: { 
          label: `New Family Member`,
          role: 'other',
          assets: 0,
          totalValue: 0
        },
      };
    } else if (type === 'asset') {
      newNode = {
        id: newNodeId,
        type: 'asset',
        position,
        data: { 
          label: `New Asset`,
          type: 'other',
          value: 0,
          planned: false,
        },
      };
    } else {
      newNode = {
        id: newNodeId,
        type: 'trust',
        position,
        data: { 
          label: `New Trust`,
          type: 'revocable',
          assets: 0,
          totalValue: 0,
          beneficiaries: []
        },
      };
    }
    
    setNodes(nodes => [...nodes, newNode]);
    setSelectedNode(newNode);
  };
  
  // Delete selected node
  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    
    // Remove connected edges
    const newEdges = edges.filter(edge => 
      edge.source !== selectedNode.id && edge.target !== selectedNode.id
    );
    
    // Remove the node
    const newNodes = nodes.filter(node => node.id !== selectedNode.id);
    
    setEdges(newEdges);
    setNodes(newNodes);
    setSelectedNode(null);
  };
  
  // Toggle view mode
  const changeViewMode = (mode: 'default' | 'financial' | 'legal') => {
    setViewMode(mode);
    
    // Update nodes and edges appearance based on view mode
    if (mode === 'financial') {
      // Highlight financial connections and values
      setNodes(nodes => 
        nodes.map(node => ({
          ...node,
          style: {
            ...node.style,
            borderColor: node.type === 'asset' ? '#2D81FF' : undefined,
            borderWidth: node.type === 'asset' ? 2 : undefined,
          },
        }))
      );
      
      setEdges(edges => 
        edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          
          if ((sourceNode?.type === 'person' || sourceNode?.type === 'trust') && 
              targetNode?.type === 'asset') {
            return {
              ...edge,
              animated: true,
              style: { ...edge.style, stroke: '#2D81FF', strokeWidth: 2 },
            };
          }
          return edge;
        })
      );
    } else if (mode === 'legal') {
      // Highlight legal structures and inheritance
      setNodes(nodes => 
        nodes.map(node => ({
          ...node,
          style: {
            ...node.style,
            borderColor: node.type === 'trust' ? '#6E56CF' : undefined,
            borderWidth: node.type === 'trust' ? 2 : undefined,
          },
        }))
      );
      
      setEdges(edges => 
        edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          
          if ((sourceNode?.type === 'trust' || targetNode?.type === 'trust') &&
              (sourceNode?.type === 'person' || targetNode?.type === 'person')) {
            return {
              ...edge,
              animated: true,
              style: { ...edge.style, stroke: '#6E56CF', strokeWidth: 2 },
            };
          }
          return edge;
        })
      );
    } else {
      // Reset to default view
      setNodes(nodes => 
        nodes.map(node => ({
          ...node,
          style: { ...node.style, borderColor: undefined, borderWidth: undefined },
        }))
      );
      
      setEdges(edges => 
        edges.map(edge => ({
          ...edge,
          animated: false,
          style: { ...edge.style, strokeWidth: edge.style?.strokeWidth === 2 ? 1.5 : edge.style?.strokeWidth },
        }))
      );
    }
  };
  
  return (
    <div className={`w-full h-[600px] bg-navy-800 border border-navy-700 rounded ${className}`}>
      <div ref={reactFlowWrapper} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          proOptions={{ hideAttribution: true }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Controls showInteractive={!readOnly} />
          <MiniMap 
            nodeStrokeWidth={3}
            zoomable
            pannable
            nodeBorderRadius={2}
            nodeColor={(node) => {
              if (node.type === 'person') return '#102236';
              if (node.type === 'asset') return '#2D81FF';
              return '#6E56CF';
            }}
          />
          <Background color="#0a1525" gap={16} />
          
          {!readOnly && (
            <Panel position="top-left" className="bg-navy-900 p-3 rounded-sm shadow-lg">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => changeViewMode('default')}
                  className={`p-2 rounded ${viewMode === 'default' ? 'bg-navy-700' : 'hover:bg-navy-800'}`}
                  title={t('wealth.tree.defaultView')}
                >
                  <Eye size={16} className="text-neutral-200" />
                </button>
                <button 
                  onClick={() => changeViewMode('financial')}
                  className={`p-2 rounded ${viewMode === 'financial' ? 'bg-navy-700' : 'hover:bg-navy-800'}`}
                  title={t('wealth.tree.financialView')}
                >
                  <BarChart3 size={16} className="text-neutral-200" />
                </button>
                <button 
                  onClick={() => changeViewMode('legal')}
                  className={`p-2 rounded ${viewMode === 'legal' ? 'bg-navy-700' : 'hover:bg-navy-800'}`}
                  title={t('wealth.tree.legalView')}
                >
                  <FileText size={16} className="text-neutral-200" />
                </button>
              </div>
            </Panel>
          )}
          
          {!readOnly && (
            <Panel position="top-right" className="bg-navy-900 p-3 rounded-sm shadow-lg">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => addNode('person')}
                  className="p-2 rounded hover:bg-navy-700 flex items-center"
                  title={t('wealth.tree.addPerson')}
                >
                  <PlusCircle size={16} className="text-gold mr-2" />
                  <span className="text-xs text-neutral-200">{t('wealth.tree.person')}</span>
                </button>
                <button 
                  onClick={() => addNode('asset')}
                  className="p-2 rounded hover:bg-navy-700 flex items-center"
                  title={t('wealth.tree.addAsset')}
                >
                  <PlusCircle size={16} className="text-blue-400 mr-2" />
                  <span className="text-xs text-neutral-200">{t('wealth.tree.asset')}</span>
                </button>
                <button 
                  onClick={() => addNode('trust')}
                  className="p-2 rounded hover:bg-navy-700 flex items-center"
                  title={t('wealth.tree.addTrust')}
                >
                  <PlusCircle size={16} className="text-purple-400 mr-2" />
                  <span className="text-xs text-neutral-200">{t('wealth.tree.trust')}</span>
                </button>
                
                {selectedNode && (
                  <button 
                    onClick={deleteSelectedNode}
                    className="p-2 rounded hover:bg-red-900/30 flex items-center mt-4"
                    title={t('wealth.tree.deleteSelected')}
                  >
                    <Trash2 size={16} className="text-red-400 mr-2" />
                    <span className="text-xs text-neutral-200">{t('wealth.tree.delete')}</span>
                  </button>
                )}
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

export default FamilyWealthTree;