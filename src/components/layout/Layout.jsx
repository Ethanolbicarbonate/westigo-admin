import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const drawerWidth = 260;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Header (AppBar) */}
      <Header onMobileToggle={handleDrawerToggle} />

      {/* Sidebar (Responsive Drawer) */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        onClose={handleDrawerToggle} 
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Toolbar /> {/* Spacer to push content below fixed Header */}
        <Outlet />
      </Box>
    </Box>
  );
}