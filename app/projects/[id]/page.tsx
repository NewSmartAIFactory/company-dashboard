import { ArrowLeft, Boxes } from "lucide-react";
import Link from "next/link";
import { ProjectForm } from "../../components/ProjectForm";
import { StatusBadge } from "../../components/StatusBadge";
import { getProjectDetail } from "../../lib/api";

type ProjectPageProps = { params: Promise<{ id: string }> };

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectDetail(id);
  return <main className="detailShell">
    <Link className="backLink" href="/projects"><ArrowLeft size={16} /> Back to projects</Link>
    <header className="detailHeader"><div><p className="eyebrow">Project Detail</p><h1>{project.name}</h1><p className="detailSubtitle">{project.currentSprint ?? "No active sprint"} · Updated {new Date(project.updatedAtUtc).toLocaleString("en-GB")}</p></div><StatusBadge status={project.status} /></header>
    <section className="panel"><div className="panelHeader"><h2>Edit Project</h2><Boxes size={20} /></div><ProjectForm project={project} /></section>
  </main>;
}
