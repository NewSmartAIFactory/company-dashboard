type StatusBadgeProps = {
  status: string;
};

const statusClass: Record<string, string> = {
  Idle: "badge badgeNeutral",
  Working: "badge badgeGreen",
  WaitingApproval: "badge badgeAmber",
  Blocked: "badge badgeRed",
  Offline: "badge badgeMuted"
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={statusClass[status] ?? "badge badgeNeutral"}>{status}</span>;
}
