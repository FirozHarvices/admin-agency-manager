import { TicketStatus } from '../types';
import { TICKET_STATUS_CONFIG } from '../constants';

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const config = TICKET_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeBg} ${config.badgeText}`}
    >
      {config.label}
    </span>
  );
}
