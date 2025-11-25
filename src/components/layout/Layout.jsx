import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Avatar 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business'; 
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'; 
import EventIcon from '@mui/icons-material/Event';
import ViewListIcon from '@mui/icons-material/ViewList';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError } from '../../utils/toast';

const drawerWidth = 240;

export default function Layout() {
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
      showError('Failed to logout. Please try again.');
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Facilities', icon: <BusinessIcon />, path: '/facilities' },
    { text: 'Spaces', icon: <MeetingRoomIcon />, path: '/spaces' },
    { text: 'Events', icon: <EventIcon />, path: '/events' },
    { text: 'Master List', icon: <ViewListIcon />, path: '/lists' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Westigo Admin
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar (Drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          },
        }}
      >
        <Toolbar /> {/* Spacing for the AppBar */}
        
        {/* Navigation Items (Pushed to top) */}
        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon color={location.pathname === item.path ? "primary" : "inherit"}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* User Profile & Logout (Pinned to bottom) */}
        <Divider />
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
              <Avatar 
                sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.875rem' }}
              >
                {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
              </Avatar>
              <Typography variant="caption" noWrap sx={{ fontWeight: 500, maxWidth: 140 }} title={user.email}>
                {user.email}
              </Typography>
            </Box>
          )}
          
          <ListItemButton 
            onClick={handleLogout} 
            sx={{ 
              borderRadius: 1, 
              color: 'error.main',
              '&:hover': { bgcolor: 'error.lighter', color: 'error.dark' } 
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> 
        <Outlet />
      </Box>
    </Box>
  );
}