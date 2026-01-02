
export enum UserRole {
  GOVERNMENT = 'GOVERNMENT',
  NGO = 'NGO',
  UNAUTHENTICATED = 'UNAUTHENTICATED'
}

export enum TaskStatus {
  OPEN = 'OPEN',
  CLAIMED = 'CLAIMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Med',
  HIGH = 'High',
  CRITICAL = 'CRITICAL'
}

export interface Incident {
  id: string;
  timestamp: Date;
  reporter: string;
  description: string;
  coordinates: { lat: number; lng: number };
  type?: string;
  severity_score?: number;
  urgency?: string;
  suggested_action?: string;
  isAnalyzed: boolean;
  isConvertedToTask: boolean;
}

export interface Task {
  id: string;
  incidentId: string;
  title: string;
  priority: Priority;
  requiredResources: string[];
  status: TaskStatus;
  claimedBy?: string; // NGO ID
  createdAt: Date;
  coordinates: { lat: number; lng: number };
}

export interface NGOProfile {
  id: string;
  name: string;
  activeVolunteers: number;
}

export interface GeminiAnalysis {
  type: string;
  severity_score: number;
  urgency: string;
  suggested_action: string;
}
