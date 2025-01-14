import { Position, PositionType, PositionStatus } from './Position';
import { Portfolio } from './Portfolio';
import { Strategy } from './Strategy';
import { JsonValue } from '@prisma/client/runtime/library';

export interface PositionWithRelations extends Position {
  portfolio: {
    id: string;
    name: string;
    userId: string;
    description: string | null;
    metadata: JsonValue;
    balance: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
  };
  strategy?: {
    id: string;
    name: string;
    userId: string;
    description: string;
    type: string;
    parameters: JsonValue;
    isActive: boolean;
    performance: JsonValue;
    metadata: JsonValue;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}
