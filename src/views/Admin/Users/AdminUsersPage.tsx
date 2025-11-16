'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import Layout from '@/components/Layout';
import { useAuthStore } from '@/valtio/auth';
import { supabase } from '@/lib/supabase/client';

interface UserRole {
  role: string;
}

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  user_roles: UserRole[];
}

const AdminUsersPage = () => {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    const profiles = profilesData as Omit<User, 'user_roles'>[] | null;

    if (profiles) {
      const userIds = profiles.map((u) => u.id);
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      const usersWithRoles = profiles.map((profile) => ({
        ...profile,
        user_roles: rolesData?.filter((r) => r.user_id === profile.id).map((r) => ({ role: r.role })) || [],
      }));

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (search) {
      const filtered = users.filter(
        (u) => u.username?.toLowerCase().includes(search.toLowerCase())
          || u.first_name?.toLowerCase().includes(search.toLowerCase())
          || u.last_name?.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [search, users]);

  const getInitials = (usr: User) => {
    if (usr.first_name && usr.last_name) {
      return `${usr.first_name[0]}${usr.last_name[0]}`.toUpperCase();
    }
    return usr.username.substring(0, 2).toUpperCase();
  };

  const getFullName = (usr: User) => {
    if (usr.first_name && usr.last_name) {
      return `${usr.first_name} ${usr.last_name}`;
    }
    return usr.username;
  };

  if (authLoading || !user) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              User Management
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">No users found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((usr) => (
                      <TableRow key={usr.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={usr.avatar_url || undefined}>
                              {getInitials(usr)}
                            </Avatar>
                            <Typography>{getFullName(usr)}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{usr.username}</TableCell>
                        <TableCell>
                          {usr.user_roles.length > 0 ? (
                            usr.user_roles.map((role, idx) => (
                              <Chip
                                key={idx}
                                label={role.role}
                                size="small"
                                color={role.role === 'admin' ? 'error' : 'default'}
                                sx={{ mr: 0.5 }}
                              />
                            ))
                          ) : (
                            <Chip label="user" size="small" />
                          )}
                        </TableCell>
                        <TableCell>{usr.phone || '-'}</TableCell>
                        <TableCell>
                          {new Date(usr.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" title="View">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Edit">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Delete" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total Users: {filteredUsers.length}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default AdminUsersPage;
