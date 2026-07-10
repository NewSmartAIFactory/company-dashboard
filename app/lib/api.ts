export type AgentStatus = "Idle" | "Working" | "WaitingApproval" | "Blocked" | "Offline";

export type AgentSummary = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  currentTask: string | null;
};

export type ProjectSummary = {
  id: string;
  name: string;
  status: string;
  progressPercent: number;
  currentSprint: string | null;
};

export type WorkflowSummary = {
  id: string;
  name: string;
  status: string;
  steps: string[];
};

export type FactoryData = {
  agents: AgentSummary[];
  projects: ProjectSummary[];
  workflows: WorkflowSummary[];
};

const baseUrl = process.env.NEXT_PUBLIC_COMPANY_API_BASE_URL ?? "http://localhost:5000";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${path} (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function getFactoryData(): Promise<FactoryData> {
  const [agents, projects, workflows] = await Promise.all([
    getJson<AgentSummary[]>("/api/agents"),
    getJson<ProjectSummary[]>("/api/projects"),
    getJson<WorkflowSummary[]>("/api/workflows")
  ]);

  return { agents, projects, workflows };
}
