type StatusBadgeProps = {
  status: string | number | null | undefined;
};

const numericStatusMap: Record<number, string> = {
  0: "Idle",
  1: "Working",
  2: "WaitingApproval",
  3: "Blocked",
  4: "Offline"
};

function getDisplayStatus(status: StatusBadgeProps["status"]) {
  if (typeof status === "number") {
    return numericStatusMap[status] ?? String(status);
  }

  if (typeof status === "string" && status.trim().length > 0) {
    return status;
  }

  return "Unknown";
}

function getStatusClass(status: string) {
  const normalized = status.replace(/\s/g, "");
  return `badge badge${normalized}`;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const displayStatus = getDisplayStatus(status);

  return <span className={getStatusClass(displayStatus)}>{displayStatus}</span>;
}