"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { companyApiBaseUrl, ProjectSummary, SprintDetail } from "../lib/api";

export function SprintForm({ sprint, projects }: { sprint?: SprintDetail; projects: ProjectSummary[] }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(null); const form = new FormData(event.currentTarget);
    const body = { id: sprint ? undefined : String(form.get("id")), projectId: String(form.get("projectId")), name: String(form.get("name")), goal: String(form.get("goal")), status: String(form.get("status")), startDate: String(form.get("startDate")) || null, endDate: String(form.get("endDate")) || null, actor: "PM" };
    try {
      const response = await fetch(`${companyApiBaseUrl}/api/sprints${sprint ? `/${sprint.id}` : ""}`, { method: sprint ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!response.ok) { const problem = await response.json().catch(() => null) as { message?: string } | null; throw new Error(problem?.message ?? `Request failed with ${response.status}`); }
      const saved = await response.json() as SprintDetail; router.push(`/sprints/${saved.id}`); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save sprint."); } finally { setBusy(false); }
  }
  return <form className="projectForm" onSubmit={submit}>
    {!sprint && <label>Sprint ID<input name="id" placeholder="sprint-2" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></label>}
    <label>Project<select name="projectId" defaultValue={sprint?.projectId}>{projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label>
    <label>Sprint name<input name="name" defaultValue={sprint?.name} required /></label>
    <label>Status<select name="status" defaultValue={sprint?.status ?? "Planned"}>{['Planned','Active','Completed','Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></label>
    <label>Start date<input name="startDate" type="date" defaultValue={sprint?.startDate ?? ""} /></label>
    <label>End date<input name="endDate" type="date" defaultValue={sprint?.endDate ?? ""} /></label>
    <label className="fullField">Sprint goal<textarea name="goal" rows={4} defaultValue={sprint?.goal ?? ""} required /></label>
    {error && <p className="formError" role="alert">{error}</p>}<div className="formActions"><button className="primaryButton" disabled={busy}>{busy ? "Saving…" : sprint ? "Save sprint" : "Create sprint"}</button></div>
  </form>;
}
