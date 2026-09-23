'use client';

import { memo } from 'react';
import {
  BaseEdge,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 12,
  });

  const isRisk = (data as Record<string, unknown>)?.isRisk;

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        strokeWidth: isRisk ? 2.5 : 1.5,
        stroke: isRisk ? '#DA1E28' : '#E0E0E0',
        strokeDasharray: isRisk ? '6 3' : 'none',
        ...style,
      }}
    />
  );
}

export default memo(CustomEdge);
