import { ArrowLeft, Bot, Wrench } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "../../components/StatusBadge";
import { getAgentDetail } from "../../lib/api";

type AgentPageProps = { params: Promise<{ id: string }> };

export default async function AgentPage({ params }: AgentPageProps) {
  const { id } = await params;
  const agent = await getAgentDetail(id);

  return (
    <main className="detailShell">
      <Link className="backLink" href="/"><ArrowLeft size={16} /> Back to control center</Link>
      <header className="detailHeader">
        <div>
          <p className="eyebrow">Agent Registry</p>
          <h1>{agent.name}</h1>
          <p className="detailSubtitle">{agent.department} · {agent.role}</p>
        </div>
        <StatusBadge status={agent.status} />
      </header>

      <section className="detailGrid">
        <article className="panel detailCard">
          <div className="panelHeader"><h2>Prompt</h2><Bot size={20} /></div>
          <pre>{agent.prompt}</pre>
        </article>
        <article className="panel detailCard">
          <div className="panelHeader"><h2>Rules</h2></div>
          <pre>{agent.rules}</pre>
        </article>
        <article className="panel detailCard">
          <div className="panelHeader"><h2>Workflow</h2></div>
          <pre>{agent.workflow}</pre>
        </article>
        <article className="panel detailCard">
          <div className="panelHeader"><h2>Memory Scope</h2></div>
          <pre>{agent.memoryScope}</pre>
        </article>
      </section>

      <section className="panel wide">
        <div className="panelHeader"><h2>Allowed Tools</h2><Wrench size={20} /></div>
        <div className="toolList">{agent.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
      </section>
    </main>
  );
}
