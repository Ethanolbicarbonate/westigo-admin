import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  MapPin, 
  Calendar, 
  List, 
  LogOut, 
  X 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError } from '../../utils/toast';
import { cn } from '../../utils/cn';
import logo from '../../assets/westigo_admin_logo.svg'; // Import the logo

export default function Sidebar({ onClose, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      showError('Failed to logout');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Facilities', href: '/facilities', icon: Building2 },
    { name: 'Spaces', href: '/spaces', icon: MapPin },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Master List', href: '/lists', icon: List },
  ];

  return (
    <div className="flex flex-col h-full bg-ios-card border-r border-ios-separator">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 px-6 border-b border-ios-separator/50">
        <div className="flex items-center">
          <img src={logo} alt="Westigo Admin Logo" className="h-8 w-auto" />
        </div>
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-ios-gray hover:text-ios-label transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) => cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-ios transition-all duration-200 ease-in-out",
                isActive 
                  ? "bg-ios-blue text-white shadow-ios-sm" 
                  : "text-ios-secondaryLabel hover:bg-ios-gray6 hover:text-ios-label"
              )}
            >
              <item.icon 
                className={cn(
                  "mr-3 h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-ios-gray group-hover:text-ios-label"
                )} 
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-ios-separator/50 bg-ios-bg/30">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="h-9 w-9 rounded-full bg-ios-gray4 flex items-center justify-center text-ios-label font-semibold text-sm">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ios-label truncate">
              {user?.email}
            </p>
            <p className="text-xs text-ios-secondaryLabel truncate">
              Administrator
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-2 py-2 text-sm font-medium text-ios-red rounded-ios hover:bg-ios-red/10 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}