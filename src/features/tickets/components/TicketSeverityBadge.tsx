import { TicketSeverity } from '../types';
import { TICKET_SEVERITY_CONFIG } from '../constants';

interface TicketSeverityBadgeProps {
  severity: TicketSeverity;
}

export function TicketSeverityBadge({ severity }: TicketSeverityBadgeProps) {
  const config = TICKET_SEVERITY_CONFIG[severity];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeBg} ${config.badgeText}`}
    >
      {config.label}
    </span>
  );
}
