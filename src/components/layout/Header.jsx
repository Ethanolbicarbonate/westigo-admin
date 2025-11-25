import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';

export default function Header({ onMobileToggle }) {
  const location = useLocation();

  // Dynamic Title mapping
  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Dashboard Overview';
      case '/facilities': return 'Facilities';
      case '/spaces': return 'Spaces';
      case '/events': return 'Events';
      case '/lists': return 'Master Lists';
      default: return 'Westigo Admin';
    }
  };

  const title = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-ios-separator/50 bg-ios-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-ios-bg/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden -ml-2 p-2 text-ios-label hover:bg-black/5 rounded-full transition-colors"
            onClick={onMobileToggle}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl font-bold text-ios-label tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right: Actions */}
      </div>
    </header>
  );
}