export type AgentStatus = "Idle" | "Working" | "WaitingApproval" | "Blocked" | "Offline";

export type AgentSummary = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  currentTask: string | null;
};

export type AgentDetail = AgentSummary & {
  department: string;
  prompt: string;
  rules: string;
  workflow: string;
  memoryScope: string;
  tools: string[];
  definitionPath: string | null;
  definitionUpdatedAtUtc: string | null;
};

export type ProjectSummary = {
  id: string;
  name: string;
  status: string;
  progressPercent: number;
  currentSprint: string | null;
};

export type ProjectDetail = ProjectSummary & {
  description: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
};

export type SprintSummary = {
  id: string; projectId: string; name: string; goal: string; status: string;
  startDate: string | null; endDate: string | null; taskCount: number; completedTaskCount: number;
};

export type SprintDetail = SprintSummary & {
  createdAtUtc: string; updatedAtUtc: string; backlog: TaskSummary[];
};

export type WorkflowSummary = {
  id: string;
  name: string;
  status: string;
  steps: string[];
};

export type TaskSummary = {
  id: string;
  projectId: string;
  title: string;
  ownerAgentId: string;
  status: string;
  priority: string;
  acceptanceCriteria: string[];
};

export type TaskDetail = TaskSummary & { sprintId: string | null; description: string | null; dueDate: string | null; dependencies: string[]; createdAtUtc: string; updatedAtUtc: string; activity: AuditLogSummary[]; };

export type DecisionSummary = {
  id: string;
  projectId: string;
  title: string;
  status: string;
  requestedBy: string;
  impact: string;
  recommendation: string;
};

export type ReportSummary = {
  id: string;
  projectId: string;
  reportType: string;
  period: string;
  progressPercent: number;
  done: string[];
  doing: string[];
  blocked: string[];
  decisionsNeeded: string[];
  summary: string | null;
  publishedBy: string;
  createdAtUtc: string | null;
};

export type AuditLogSummary = {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  actor: string;
  previousValue: string | null;
  newValue: string | null;
  reason: string | null;
  createdAtUtc: string;
};
export type ApprovalSummary={id:string;projectId:string;title:string;requestedBy:string;status:string;createdAtUtc:string;updatedAtUtc:string};
export type ApprovalHistoryItem={id:number;action:string;actor:string;comment:string|null;createdAtUtc:string};
export type ApprovalDetail=ApprovalSummary&{description:string;scopeImpact:string|null;costImpact:string|null;timelineImpact:string|null;securityImpact:string|null;architectureImpact:string|null;history:ApprovalHistoryItem[]};
export type DomainEvent={id:string;eventType:string;aggregateType:string;aggregateId:string;projectId:string|null;correlationId:string;actor:string;payload:Record<string,unknown>;occurredAtUtc:string;publishAttempts:number;publishedAtUtc:string|null;lastPublishError:string|null};
export type WorkflowRun={id:string;workflowId:string;projectId:string;status:string;currentStepOrder:number;currentStep:string;nextAgent:string|null;initiatedBy:string;startedAtUtc:string;updatedAtUtc:string;completedAtUtc:string|null};
export type AgentRun={id:string;agentId:string;taskId:string|null;projectId:string|null;status:string;inputText:string;outputText:string|null;durationMs:number|null;filesTouched:string[];decisionRequested:string|null;error:string|null;startedAtUtc:string;completedAtUtc:string|null};
export type MemorySummary={id:string;scope:string;memoryType:string;title:string;content:string;projectId:string|null;agentId:string|null;source:string|null;isObsolete:boolean;createdAtUtc:string;updatedAtUtc:string};

export type FactoryData = {
  agents: AgentSummary[];
  projects: ProjectSummary[];
  workflows: WorkflowSummary[];
  tasks: TaskSummary[];
  decisions: DecisionSummary[];
  reports: ReportSummary[];
  auditLogs: AuditLogSummary[];
};

export const companyApiBaseUrl = process.env.NEXT_PUBLIC_COMPANY_API_BASE_URL ?? "http://localhost:5000";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${companyApiBaseUrl}${path}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${path} (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function getFactoryData(): Promise<FactoryData> {
  const [agents, projects, workflows, tasks, decisions, reports, auditLogs] = await Promise.all([
    getJson<AgentSummary[]>("/api/agents"),
    getJson<ProjectSummary[]>("/api/projects"),
    getJson<WorkflowSummary[]>("/api/workflows"),
    getJson<TaskSummary[]>("/api/tasks"),
    getJson<DecisionSummary[]>("/api/decisions"),
    getJson<ReportSummary[]>("/api/reports"),
    getJson<AuditLogSummary[]>("/api/audit-logs?limit=12")
  ]);

  return { agents, projects, workflows, tasks, decisions, reports, auditLogs };
}

export function getAgentDetail(id: string): Promise<AgentDetail> {
  return getJson<AgentDetail>(`/api/agents/${encodeURIComponent(id)}`);
}

export function getProjects(): Promise<ProjectSummary[]> {
  return getJson<ProjectSummary[]>("/api/projects");
}

export function getProjectDetail(id: string): Promise<ProjectDetail> {
  return getJson<ProjectDetail>(`/api/projects/${encodeURIComponent(id)}`);
}

export function getSprints(projectId?: string): Promise<SprintSummary[]> {
  return getJson<SprintSummary[]>(`/api/sprints${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`);
}

export function getSprintDetail(id: string): Promise<SprintDetail> {
  return getJson<SprintDetail>(`/api/sprints/${encodeURIComponent(id)}`);
}

export function getTasks(): Promise<TaskSummary[]> { return getJson<TaskSummary[]>("/api/tasks"); }
export function getTaskDetail(id: string): Promise<TaskDetail> { return getJson<TaskDetail>(`/api/tasks/${encodeURIComponent(id)}`); }
export function getApprovals():Promise<ApprovalSummary[]>{return getJson<ApprovalSummary[]>("/api/approvals");}
export function getApprovalDetail(id:string):Promise<ApprovalDetail>{return getJson<ApprovalDetail>(`/api/approvals/${encodeURIComponent(id)}`);}
export function getReports():Promise<ReportSummary[]>{return getJson<ReportSummary[]>("/api/reports");}
export function getReportDetail(id:string):Promise<ReportSummary>{return getJson<ReportSummary>(`/api/reports/${encodeURIComponent(id)}`);}
export function getEvents():Promise<DomainEvent[]>{return getJson<DomainEvent[]>("/api/events?limit=100");}
export function getWorkflowRuns():Promise<WorkflowRun[]>{return getJson<WorkflowRun[]>("/api/workflow-runs");}
export function getAgentRuns():Promise<AgentRun[]>{return getJson<AgentRun[]>("/api/agent-runs?limit=100");}
export function getMemories(query?:string):Promise<MemorySummary[]>{return getJson<MemorySummary[]>(`/api/memory/search${query?`?q=${encodeURIComponent(query)}`:""}`);}
export function getSemanticMemories(query:string):Promise<MemorySummary[]>{return getJson<MemorySummary[]>(`/api/memory/semantic-search?q=${encodeURIComponent(query)}`);}
export type QdrantHealth={collection:string;healthy:boolean;error?:string};
export function getQdrantHealth():Promise<QdrantHealth>{return getJson<QdrantHealth>("/api/memory/qdrant/health");}
