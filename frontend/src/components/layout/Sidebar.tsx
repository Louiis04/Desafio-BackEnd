import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Avatar,
  Typography,
  Stack, 
} from '@mui/material';
import { TaskAlt, Tag, AccountCircle, Settings } from '@mui/icons-material'; // Icons for links
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Get user info from context

  const isActive = (path: string) => location.pathname === path;

  const drawerContent = (
    <div>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" noWrap component="div">
          My App
        </Typography>
      </Toolbar>
      <Divider />
      {user && ( // Display user info if logged in
        <Box sx={{ p: 2, textAlign: 'center' }}>
           <Stack direction="column" alignItems="center" spacing={1}> {/* Use Stack */}
             <Avatar sx={{ width: 56, height: 56, mb: 1 }}>
               {/* Display first letter of username or a default icon */}
               {user.name ? user.name[0].toUpperCase() : <AccountCircle />}
             </Avatar>
             <Typography variant="subtitle1">{user.name}</Typography>
             <Typography variant="body2" color="text.secondary">{user.email}</Typography>
           </Stack>
        </Box>
      )}
      <Divider />
      <List>
        {[
          { text: 'Tasks', path: '/tasks', icon: <TaskAlt /> },
          { text: 'Tags', path: '/tags', icon: <Tag /> },
          { text: 'Profile', path: '/profile', icon: <Settings /> }, 
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (mobileOpen) handleDrawerToggle();
              }}
              selected={isActive(item.path)} 
              sx={{
                '&.Mui-selected': { 
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  }
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
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
};