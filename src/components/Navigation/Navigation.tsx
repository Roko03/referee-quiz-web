'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Divider,
  Box,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Trophy,
  Person,
  Logout,
  People,
  Quiz,
} from '@mui/icons-material';

import { useAuthStore, signOut } from '@/valtio/auth';
import { useUserRole } from '@/utils/hooks/useUserRole';

const Navigation = () => {
  const { user } = useAuthStore();
  const { isAdmin, isManager } = useUserRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleMenuClose();
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: 'rgba(11, 15, 25, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'hsl(220, 26%, 6%)',
                mr: 1.5,
              }}
            >
              FR
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 700,
                color: 'text.primary',
                display: { xs: 'none', sm: 'inline' },
              }}
            >
              Football Rules Quiz
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'text.primary',
                display: { xs: 'inline', sm: 'none' },
              }}
            >
              FR Quiz
            </Box>
          </Link>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            <Button component={Link} href="/leaderboard" startIcon={<Trophy />} color="inherit">
              Leaderboard
            </Button>

            {user ? (
              <>
                <Button onClick={handleMenuOpen} startIcon={<Person />} variant="outlined" color="inherit">
                  Account
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  {(isAdmin || isManager) && [
                    isAdmin && (
                      <MenuItem key="admin-users" component={Link} href="/admin/users" onClick={handleMenuClose}>
                        <ListItemIcon>
                          <People fontSize="small" />
                        </ListItemIcon>
                        Manage Users
                      </MenuItem>
                    ),
                    <MenuItem key="admin-questions" component={Link} href="/admin/questions" onClick={handleMenuClose}>
                      <ListItemIcon>
                        <Quiz fontSize="small" />
                      </ListItemIcon>
                      Manage Questions
                    </MenuItem>,
                    <Divider key="divider" />,
                  ]}
                  <MenuItem component={Link} href="/profile" onClick={handleMenuClose}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} href="/auth" variant="contained" color="primary">
                Sign In
              </Button>
            )}
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Drawer anchor="right" open={mobileMenuOpen} onClose={closeMobileMenu}>
            <Box sx={{ width: 280, pt: 2 }}>
              <List>
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/leaderboard" onClick={closeMobileMenu}>
                    <ListItemIcon>
                      <Trophy />
                    </ListItemIcon>
                    <ListItemText primary="Leaderboard" />
                  </ListItemButton>
                </ListItem>

                {user ? (
                  <>
                    {(isAdmin || isManager) && [
                      isAdmin && (
                        <ListItem key="admin-users" disablePadding>
                          <ListItemButton component={Link} href="/admin/users" onClick={closeMobileMenu}>
                            <ListItemIcon>
                              <People />
                            </ListItemIcon>
                            <ListItemText primary="Manage Users" />
                          </ListItemButton>
                        </ListItem>
                      ),
                      <ListItem key="admin-questions" disablePadding>
                        <ListItemButton component={Link} href="/admin/questions" onClick={closeMobileMenu}>
                          <ListItemIcon>
                            <Quiz />
                          </ListItemIcon>
                          <ListItemText primary="Manage Questions" />
                        </ListItemButton>
                      </ListItem>,
                      <Divider key="divider" sx={{ my: 1 }} />,
                    ]}
                    <ListItem disablePadding>
                      <ListItemButton component={Link} href="/profile" onClick={closeMobileMenu}>
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          handleSignOut();
                          closeMobileMenu();
                        }}
                      >
                        <ListItemIcon>
                          <Logout />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" />
                      </ListItemButton>
                    </ListItem>
                  </>
                ) : (
                  <ListItem disablePadding>
                    <ListItemButton component={Link} href="/auth" onClick={closeMobileMenu}>
                      <ListItemText primary="Sign In" sx={{ textAlign: 'center' }} />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
