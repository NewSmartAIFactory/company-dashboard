import { ArrowLeft, GitPullRequestArrow, Plus } from "lucide-react";
import Link from "next/link";
import { SprintForm } from "../components/SprintForm";
import { StatusBadge } from "../components/StatusBadge";
import { getProjects, getSprints } from "../lib/api";

export default async function SprintsPage() {
  const [sprints, projects] = await Promise.all([getSprints(), getProjects()]);
  return <main className="detailShell"><Link className="backLink" href="/"><ArrowLeft size={16} /> Back to control center</Link>
    <header className="detailHeader"><div><p className="eyebrow">Sprint Management</p><h1>Sprints</h1></div><GitPullRequestArrow size={28} /></header>
    <section className="detailGrid"><article className="panel"><div className="panelHeader"><h2>Sprint History</h2><GitPullRequestArrow size={20} /></div><div className="compactList">
      {sprints.map((sprint) => <Link className="compactItem" href={`/sprints/${sprint.id}`} key={sprint.id}><div><strong>{sprint.name}</strong><p>{sprint.goal}</p><span>{sprint.completedTaskCount}/{sprint.taskCount} tasks done</span></div><StatusBadge status={sprint.status} /></Link>)}
    </div></article><article className="panel"><div className="panelHeader"><h2>New Sprint</h2><Plus size={20} /></div><SprintForm projects={projects} /></article></section>
  </main>;
}
