"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { companyApiBaseUrl, ProjectDetail } from "../lib/api";

type ProjectFormProps = { project?: ProjectDetail };

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const id = String(form.get("id") ?? "").trim();
    const body = {
      id: project ? undefined : id,
      name: String(form.get("name") ?? ""),
      status: String(form.get("status") ?? "Draft"),
      progressPercent: Number(form.get("progressPercent") ?? 0),
      currentSprint: String(form.get("currentSprint") ?? "") || null,
      description: String(form.get("description") ?? "") || null,
      actor: "CEO"
    };
    try {
      const response = await fetch(`${companyApiBaseUrl}/api/projects${project ? `/${project.id}` : ""}`, {
        method: project ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const problem = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(problem?.message ?? `Request failed with ${response.status}`);
      }
      const saved = await response.json() as ProjectDetail;
      router.push(`/projects/${saved.id}`);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save project.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="projectForm" onSubmit={submit}>
      {!project && <label>Project ID<input name="id" placeholder="client-portal" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></label>}
      <label>Project name<input name="name" defaultValue={project?.name} required /></label>
      <label>Status<select name="status" defaultValue={project?.status ?? "Draft"}>
        {['Draft', 'Active', 'Paused', 'Completed', 'Archived', 'Foundation'].map((status) => <option key={status}>{status}</option>)}
      </select></label>
      <label>Progress<input name="progressPercent" type="number" min="0" max="100" defaultValue={project?.progressPercent ?? 0} required /></label>
      <label>Current sprint<input name="currentSprint" defaultValue={project?.currentSprint ?? ""} /></label>
      <label className="fullField">Description<textarea name="description" rows={5} defaultValue={project?.description ?? ""} /></label>
      {error && <p className="formError" role="alert">{error}</p>}
      <div className="formActions"><button className="primaryButton" disabled={busy}>{busy ? "Saving…" : project ? "Save project" : "Create project"}</button></div>
    </form>
  );
}
