import {
  Activity,
  Bot,
  Boxes,
  ClipboardCheck,
  FileText,
  GitPullRequestArrow,
  Network,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { DecisionActions, TaskActions } from "./components/FactoryActions";
import { StatusBadge } from "./components/StatusBadge";
import { getFactoryData } from "./lib/api";

export default async function Home() {
  const data = await getFactoryData();
  const project = data.projects[0];
  const workflow = data.workflows[0];
  const report = data.reports[0];
  const openTasks = data.tasks.filter((task) => task.status !== "Done");
  const pendingDecisions = data.decisions.filter((decision) => decision.status !== "Approved");

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
          <Link className="navItem" href="/projects"><Boxes size={18} /> Projects</Link>
          <a className="navItem" href="#"><Bot size={18} /> Agents</a>
          <a className="navItem" href="#"><ClipboardCheck size={18} /> Tasks</a>
          <a className="navItem" href="#"><ShieldCheck size={18} /> Decisions</a>
          <a className="navItem" href="#"><FileText size={18} /> Reports</a>
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
            <span>Open Tasks</span>
            <strong>{openTasks.length}</strong>
            <small>{data.tasks.length} total</small>
          </div>
          <div className="metric">
            <span>Decisions Needed</span>
            <strong>{pendingDecisions.length}</strong>
            <small>{data.decisions.length} tracked</small>
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
                <Link className="agentRow" href={`/agents/${agent.id}`} key={agent.id}>
                  <div>
                    <strong>{agent.name}</strong>
                    <span>{agent.currentTask ?? agent.role}</span>
                  </div>
                  <StatusBadge status={agent.status} />
                </Link>
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

        <section className="threeGrid">
          <div className="panel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Task Board</p>
                <h2>Sprint Work</h2>
              </div>
              <ClipboardCheck size={20} />
            </div>
            <div className="compactList">
              {data.tasks.map((task) => (
                <div className="compactItem" key={task.id}>
                  <div>
                    <strong>{task.id}</strong>
                    <p>{task.title}</p>
                    <span>{task.ownerAgentId} · {task.priority}</span>
                  </div>
                  <div className="statusColumn">
                    <StatusBadge status={task.status} />
                    <TaskActions taskId={task.id} status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Approvals</p>
                <h2>Decisions</h2>
              </div>
              <ShieldCheck size={20} />
            </div>
            <div className="compactList">
              {data.decisions.map((decision) => (
                <div className="compactItem" key={decision.id}>
                  <div>
                    <strong>{decision.id}</strong>
                    <p>{decision.title}</p>
                    <span>{decision.impact} · {decision.requestedBy}</span>
                  </div>
                  <div className="statusColumn">
                    <StatusBadge status={decision.status} />
                    <DecisionActions decisionId={decision.id} status={decision.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">PM Report</p>
                <h2>{report?.period ?? "No report"}</h2>
              </div>
              <FileText size={20} />
            </div>
            <div className="reportBlock">
              <strong>{report?.progressPercent ?? 0}% complete</strong>
              <p>Done</p>
              <ul>
                {report?.done.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p>Doing</p>
              <ul>
                {report?.doing.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="panel wide">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Audit Log</p>
              <h2>Recent Control Activity</h2>
            </div>
            <Activity size={20} />
          </div>
          <div className="auditList">
            {data.auditLogs.length === 0 ? (
              <p className="emptyState">No audited actions yet.</p>
            ) : data.auditLogs.map((entry) => (
              <div className="auditItem" key={entry.id}>
                <div>
                  <strong>{entry.entityId}</strong>
                  <p>{entry.action.replaceAll(".", " ")}</p>
                </div>
                <div className="auditMeta">
                  <span>{entry.actor}</span>
                  <time dateTime={entry.createdAtUtc}>{new Date(entry.createdAtUtc).toLocaleString("en-GB")}</time>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel wide">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Sprint 1.3</p>
              <h2>Control Actions</h2>
            </div>
            <GitPullRequestArrow size={20} />
          </div>
          <div className="checkGrid">
            <div>Mark task done</div>
            <div>Block task</div>
            <div>Approve decision</div>
            <div>Reject decision</div>
          </div>
        </section>
      </section>
    </main>
  );
}
