
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, LogOut } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown, DropdownItem } from '../ui/Dropdown'; 
import { logout } from '../../features/auth/store/authSlice'; 
import { AppDispatch, RootState } from '../../store';

export function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const getFirstName = (name: string = '') => name.split(' ')[0];
  const getShortName = (name: string = '') => {
      const words = name.split(' ').filter(Boolean);
      if (words.length === 0) return 'User';
      const firstName = words[0];
      const lastInitial = words.length > 1 ? `${words[words.length - 1].charAt(0)}.` : '';
      return `${firstName} ${lastInitial}`.trim();
  }

  const displayName = user ? user.name : 'Guest';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-bold text-brand-text-primary">
          Good Morning, {getFirstName(displayName)}! 👋
        </h1>
        <p className="text-sm text-brand-text-secondary">Let's create creative websites for your clients!</p>
      </div>
      <div className="flex items-center gap-6">
          {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-text-secondary" />
          <input
            type="text"
            placeholder="Search for something"
            className="pl-10 pr-4 py-2 w-64 bg-white rounded-lg border border-brand-border focus:ring-1 focus:ring-brand-primary focus:outline-none"
          />
        </div> */}
        
        <Dropdown
          button={
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar name={displayName} />
              <div>
                <span className="font-semibold text-brand-text-primary">{getShortName(displayName)}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-brand-text-secondary" />
            </div>
          }
        >
          <DropdownItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
            Log Out
          </DropdownItem>
        </Dropdown>

      </div>
    </header>
  );
}