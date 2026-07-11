import { ArrowLeft, Boxes, Plus } from "lucide-react";
import Link from "next/link";
import { ProjectForm } from "../components/ProjectForm";
import { StatusBadge } from "../components/StatusBadge";
import { getProjects } from "../lib/api";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <main className="detailShell">
    <Link className="backLink" href="/"><ArrowLeft size={16} /> Back to control center</Link>
    <header className="detailHeader"><div><p className="eyebrow">Project Management</p><h1>Projects</h1></div><Boxes size={28} /></header>
    <section className="detailGrid">
      <article className="panel"><div className="panelHeader"><h2>Portfolio</h2><Boxes size={20} /></div><div className="compactList">
        {projects.map((project) => <Link className="compactItem" href={`/projects/${project.id}`} key={project.id}><div><strong>{project.name}</strong><p>{project.currentSprint ?? "No active sprint"}</p><span>{project.progressPercent}% complete</span></div><StatusBadge status={project.status} /></Link>)}
      </div></article>
      <article className="panel"><div className="panelHeader"><h2>New Project</h2><Plus size={20} /></div><ProjectForm /></article>
    </section>
  </main>;
}
