import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Avatar, 
  Typography, 
  Toolbar 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import ViewListIcon from '@mui/icons-material/ViewList'; // Add Master List Icon
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError } from '../../utils/toast';

const drawerWidth = 260;

export default function Sidebar({ mobileOpen, onClose }) {
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

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Facilities', icon: <BusinessIcon />, path: '/facilities' },
    { text: 'Spaces', icon: <MeetingRoomIcon />, path: '/spaces' },
    { text: 'Events', icon: <EventIcon />, path: '/events' },
    { text: 'Master List', icon: <ViewListIcon />, path: '/lists' },
  ];

  // Define the drawer content once to reuse it
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 1. Header / Logo Area */}
      <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          Westigo Admin
        </Typography>
      </Toolbar>
      <Divider />

      {/* 2. User Info Section */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.default' }}>
        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
          {user?.email?.[0]?.toUpperCase() || 'A'}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="subtitle2" noWrap title={user?.email} sx={{ fontWeight: 600 }}>
            {user?.email || 'Admin'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Administrator
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* 3. Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', py: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5, px: 1 }}>
                <ListItemButton 
                  selected={isActive}
                  onClick={() => {
                    navigate(item.path);
                    if (onClose) onClose(); // Close drawer on mobile selection
                  }}
                  sx={{
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.main' },
                      '& .MuiListItemIcon-root': { color: 'inherit' }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'inherit' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* 4. Logout */}
      <Divider />
      <Box sx={{ p: 1 }}>
        <ListItemButton 
          onClick={handleLogout} 
          sx={{ 
            borderRadius: 1,
            color: 'error.main', 
            '&:hover': { bgcolor: 'error.lighter', color: 'error.dark' } 
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}