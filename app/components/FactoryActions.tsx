"use client";

import { useRouter } from "next/navigation";
import { Check, CircleSlash, Loader2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { companyApiBaseUrl } from "../lib/api";

type TaskActionsProps = {
  taskId: string;
  status: string;
};

type DecisionActionsProps = {
  decisionId: string;
  status: string;
};

async function sendJson(path: string, method: "PATCH" | "POST", body: unknown) {
  const response = await fetch(`${companyApiBaseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }
}

export function TaskActions({ taskId, status }: TaskActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const isDone = status === "Done";
  const isBlocked = status === "Blocked";

  async function updateStatus(nextStatus: string) {
    setBusy(nextStatus);
    try {
      await sendJson(`/api/tasks/${taskId}/status`, "PATCH", { status: nextStatus });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="actionRow">
      <button
        aria-label="Mark task done"
        className="iconButton success"
        disabled={busy !== null || isDone}
        title="Mark task done"
        onClick={() => updateStatus("Done")}
      >
        {busy === "Done" ? <Loader2 size={15} className="spin" /> : <Check size={15} />}
      </button>
      <button
        aria-label="Block task"
        className="iconButton danger"
        disabled={busy !== null || isBlocked}
        title="Block task"
        onClick={() => updateStatus("Blocked")}
      >
        {busy === "Blocked" ? <Loader2 size={15} className="spin" /> : <CircleSlash size={15} />}
      </button>
    </div>
  );
}

export function DecisionActions({ decisionId, status }: DecisionActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const isFinal = status === "Approved" || status === "Rejected";

  async function decide(action: "approve" | "reject") {
    setBusy(action);
    try {
      await sendJson(`/api/decisions/${decisionId}/${action}`, "POST", {
        decidedBy: "CEO",
        reason: `Decision ${action}d from dashboard`
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="actionRow">
      <button
        aria-label="Approve decision"
        className="iconButton success"
        disabled={busy !== null || isFinal}
        title="Approve decision"
        onClick={() => decide("approve")}
      >
        {busy === "approve" ? <Loader2 size={15} className="spin" /> : <ThumbsUp size={15} />}
      </button>
      <button
        aria-label="Reject decision"
        className="iconButton danger"
        disabled={busy !== null || isFinal}
        title="Reject decision"
        onClick={() => decide("reject")}
      >
        {busy === "reject" ? <Loader2 size={15} className="spin" /> : <ThumbsDown size={15} />}
      </button>
    </div>
  );
}
