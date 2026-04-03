import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, Ticket } from 'lucide-react';
import { useTickets } from '@/features/tickets/hooks';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tickets', label: 'Support Tickets', icon: Ticket },
  // { to: '/billing-plan', label: 'Billing Plan', icon: CreditCard },
  // { to: '/user-master', label: 'User Master', icon: Users },
];

// const supportItems = [
//   { to: '/notifications', label: 'Notifications', icon: Bell },
//   { to: '/support', label: 'Support', icon: LifeBuoy },
// ];

export function Sidebar() {
  const { data: tickets } = useTickets();
  const totalUnread = tickets?.reduce((sum, t) => sum + (t.unread_count || 0), 0) ?? 0;

  return (
    <aside className="w-64 flex-shrink-0 bg-white rounded-2xl shadow-sm flex flex-col">

      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6">
        <Sparkles className="h-6 w-6 text-brand-primary mr-2" />
        <span className="text-xl font-bold text-brand-secondary">Magicpagez</span>
      </div>

      <div>
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-primary-light text-brand-primary'
                     : 'text-brand-text-secondary hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
              {item.to === '/tickets' && totalUnread > 0 && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Separator line */}
        {/* <div className="px-4 my-4">
          <div className="border-t border-gray-200" />
        </div> */}

        {/* <nav className="px-4 space-y-1">
          {supportItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center px-3 py-2.5 rounded-lg font-medium text-sm text-brand-text-secondary hover:bg-gray-100"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav> */}
      </div>

      <div className="mt-auto p-4 px-12">
        {/* <Button className="w-full bg-[#5D50FE]">
          <Crown color='#FFB31F' className="w-4 h-4 mr-2" />
          Upgrade Plan
        </Button> */}
      </div>
    </aside>
  );
}
