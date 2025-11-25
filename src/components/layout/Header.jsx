import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

// Must match the width used in Sidebar.jsx
const drawerWidth = 260;

export default function Header({ onMobileToggle }) {
  const location = useLocation();

  // Dynamic Title based on current route
  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Dashboard Overview';
      case '/facilities': return 'Facilities Management';
      case '/spaces': return 'Space Management';
      case '/events': return 'Campus Events';
      case '/lists': return 'Master Data Lists';
      default: return 'Westigo Admin';
    }
  };

  const title = getPageTitle(location.pathname);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      <Toolbar>
        {/* Mobile Menu Toggle (Visible only on small screens) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMobileToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Quick Actions (Placeholder) */}
        <IconButton size="large" color="inherit">
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}