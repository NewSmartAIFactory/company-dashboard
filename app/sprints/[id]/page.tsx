import { ArrowLeft, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { SprintForm } from "../../components/SprintForm";
import { StatusBadge } from "../../components/StatusBadge";
import { getProjects, getSprintDetail } from "../../lib/api";

type SprintPageProps = { params: Promise<{ id: string }> };
export default async function SprintPage({ params }: SprintPageProps) {
  const { id } = await params; const [sprint, projects] = await Promise.all([getSprintDetail(id), getProjects()]);
  return <main className="detailShell"><Link className="backLink" href="/sprints"><ArrowLeft size={16} /> Back to sprints</Link>
    <header className="detailHeader"><div><p className="eyebrow">Sprint Detail</p><h1>{sprint.name}</h1><p className="detailSubtitle">{sprint.goal}</p></div><StatusBadge status={sprint.status} /></header>
    <section className="detailGrid"><article className="panel"><div className="panelHeader"><h2>Edit Sprint</h2></div><SprintForm sprint={sprint} projects={projects} /></article>
      <article className="panel"><div className="panelHeader"><h2>Backlog</h2><ClipboardCheck size={20} /></div><div className="compactList">{sprint.backlog.length === 0 ? <p className="emptyState">No tasks assigned to this sprint.</p> : sprint.backlog.map((task) => <div className="compactItem" key={task.id}><div><strong>{task.id}</strong><p>{task.title}</p></div><StatusBadge status={task.status} /></div>)}</div></article></section>
  </main>;
}
