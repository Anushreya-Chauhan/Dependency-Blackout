'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { AlertTriangle, Package, FileCode, Server } from 'lucide-react';

export interface CustomNodeData {
  label: string;
  nodeType: 'package' | 'file' | 'service' | 'repo' | 'root';
  isFlagged?: boolean;
  riskType?: string;
  ecosystem?: string;
  version?: string;
}

type CustomNodeProps = NodeProps & { data: CustomNodeData };

function CustomNode({ data, selected }: CustomNodeProps) {
  const { label, nodeType, isFlagged, riskType, version } = data;

  const isRepo = nodeType === 'repo' || nodeType === 'root';

  const icons: Record<string, React.ReactNode> = {
    package: <Package className="h-3.5 w-3.5" />,
    file: <FileCode className="h-3.5 w-3.5" />,
    service: <Server className="h-3.5 w-3.5" />,
    repo: <Package className="h-4 w-4" />,
    root: <Package className="h-4 w-4" />,
  };

  const getNodeStyle = () => {
    if (isFlagged) {
      return 'border-danger bg-danger-bg shadow-[0_0_0_1px_rgba(218,30,40,0.2)]';
    }
    if (isRepo) {
      return 'border-ibm-blue bg-ibm-blue-10';
    }
    if (nodeType === 'service') {
      return 'border-[#8A3FFC] bg-[#F6F2FF]';
    }
    if (nodeType === 'file') {
      return 'border-[#0E6027] bg-success-bg';
    }
    return 'border-border-default bg-white';
  };

  const getIconColor = () => {
    if (isFlagged) return 'text-danger';
    if (isRepo) return 'text-ibm-blue';
    if (nodeType === 'service') return 'text-[#8A3FFC]';
    if (nodeType === 'file') return 'text-[#0E6027]';
    return 'text-text-secondary';
  };

  const riskBadgeColors: Record<string, string> = {
    malicious: 'bg-danger text-white',
    vulnerable: 'bg-[#FF832B] text-white',
    deprecated: 'bg-warning text-white',
    unavailable: 'bg-text-tertiary text-white',
  };

  return (
    <div
      className={`
        relative rounded-xl border-[1.5px] px-3.5 py-2.5 min-w-[140px] max-w-[200px]
        transition-all duration-200 cursor-pointer
        ${getNodeStyle()}
        ${selected ? 'ring-2 ring-ibm-blue ring-offset-2' : ''}
        ${isFlagged ? 'animate-pulse-danger' : 'hover:border-ibm-blue hover:shadow-[0_2px_12px_rgba(15,98,254,0.12)]'}
      `}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !border-2 !border-border-default !bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !border-2 !border-border-default !bg-white"
      />

      {/* Node content */}
      <div className="flex items-start gap-2">
        <div className={`mt-0.5 shrink-0 ${getIconColor()}`}>
          {isFlagged ? (
            <AlertTriangle className="h-3.5 w-3.5" />
          ) : (
            icons[nodeType] || icons.package
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-text-primary truncate font-mono">
            {label}
          </p>
          {version && (
            <p className="text-[10px] text-text-tertiary font-mono mt-0.5">
              v{version}
            </p>
          )}
        </div>
      </div>

      {/* Risk badge */}
      {isFlagged && riskType && (
        <div className="mt-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
              riskBadgeColors[riskType] || 'bg-text-tertiary text-white'
            }`}
          >
            {riskType}
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(CustomNode);
