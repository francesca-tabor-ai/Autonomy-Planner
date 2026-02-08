
export enum AutonomyLevelType {
  NO = 'No Autonomy',
  SUGGESTIVE = 'Suggestive',
  CONDITIONAL = 'Conditional',
  SUPERVISED = 'Supervised',
  FULL = 'Full Autonomy'
}

export interface PermissionSet {
  allowedActions: string[];
  forbiddenActions: string[];
  languageConstraints: string;
}

export interface AutonomyLevel {
  id: string;
  type: AutonomyLevelType;
  name: string;
  description: string;
  rank: number;
  permissions: PermissionSet;
  sampleProbes: string[]; // Added sample probes for testing in simulator
}

export type TriggerType = 'ConfidenceThreshold' | 'TopicClassification' | 'RiskFlag' | 'UserIntent' | 'Sentiment';

export interface EscalationPath {
  id: string;
  sourceLevelId: string;
  triggerType: TriggerType;
  triggerValue: string;
  target: 'LevelChange' | 'HumanHandoff' | 'Clarification' | 'SystemExit';
  targetLevelId?: string;
  isMandatory: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  user: string;
  action: string;
  details: string;
}

export interface SimulationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    activeLevelId?: string;
    escalationTriggered?: string;
  };
}

export interface StructuredPrd {
  problemStatement: string;
  targetAudience: string;
  keyFeatures: string[];
  successMetrics: string[];
  riskAssessment: string;
}

export interface Product {
  id: string;
  name: string;
  rawPrd: string;
  structuredPrd?: StructuredPrd;
}

export interface ProjectState {
  activeProductId: string | null;
  products: Product[];
  levels: AutonomyLevel[];
  paths: EscalationPath[];
  auditLogs: AuditLogEntry[];
}

// Added ProcessedPrdResult to central types file
export interface ProcessedPrdResult {
  structuredPrd: StructuredPrd;
  levels: AutonomyLevel[];
  paths: EscalationPath[];
}
