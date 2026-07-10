import {
  Activity,
  Bot,
  Boxes,
  GitPullRequestArrow,
  Network,
  ShieldCheck,
  Workflow
} from "lucide-react";
import { getFactoryData } from "./lib/api";
import { StatusBadge } from "./components/StatusBadge";

export default async function Home() {
  const data = await getFactoryData();
  const project = data.projects[0];
  const workflow = data.workflows[0];

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">NS</div>
          <div>
            <strong>NewSmartAIFactory</strong>
            <span>Company OS</span>
          </div>
        </div>

        <nav className="nav">
          <a className="navItem active" href="#"><Activity size={18} /> Overview</a>
          <a className="navItem" href="#"><Boxes size={18} /> Projects</a>
          <a className="navItem" href="#"><Bot size={18} /> Agents</a>
          <a className="navItem" href="#"><Workflow size={18} /> Workflows</a>
          <a className="navItem" href="#"><ShieldCheck size={18} /> Approvals</a>
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">CEO Dashboard</p>
            <h1>AI Software Factory Control Center</h1>
          </div>
          <div className="apiStatus">
            <span className="pulse" />
            API connected
          </div>
        </header>

        <section className="metrics">
          <div className="metric">
            <span>Active Project</span>
            <strong>{project?.name ?? "No project"}</strong>
            <small>{project?.currentSprint ?? "No sprint"}</small>
          </div>
          <div className="metric">
            <span>Progress</span>
            <strong>{project?.progressPercent ?? 0}%</strong>
            <small>{project?.status ?? "Unknown"}</small>
          </div>
          <div className="metric">
            <span>Agents</span>
            <strong>{data.agents.length}</strong>
            <small>registered</small>
          </div>
          <div className="metric">
            <span>Workflow</span>
            <strong>{workflow?.status ?? "None"}</strong>
            <small>{workflow?.name ?? "No workflow"}</small>
          </div>
        </section>

        <section className="mainGrid">
          <div className="panel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Agent Registry</p>
                <h2>Operating Team</h2>
              </div>
              <Bot size={20} />
            </div>
            <div className="agentList">
              {data.agents.map((agent) => (
                <div className="agentRow" key={agent.id}>
                  <div>
                    <strong>{agent.name}</strong>
                    <span>{agent.role}</span>
                  </div>
                  <StatusBadge status={agent.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Delivery Workflow</p>
                <h2>{workflow?.name ?? "Workflow"}</h2>
              </div>
              <Network size={20} />
            </div>
            <div className="timeline">
              {workflow?.steps.map((step, index) => (
                <div className="timelineItem" key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel wide">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Sprint 1.1</p>
              <h2>Foundation Checklist</h2>
            </div>
            <GitPullRequestArrow size={20} />
          </div>
          <div className="checkGrid">
            <div>Infrastructure online</div>
            <div>Company API running</div>
            <div>Dashboard connected</div>
            <div>Agent prompts prepared</div>
          </div>
        </section>
      </section>
    </main>
  );
}
