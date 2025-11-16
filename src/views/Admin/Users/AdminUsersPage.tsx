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
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

import Layout from '@/components/Layout';
import { useAuthStore } from '@/valtio/auth';
import { supabase } from '@/lib/supabase/client';
import { UserModal, DeleteUserDialog } from './UserModals';

interface UserRole {
  role: string;
}

interface UserRoleData {
  user_id: string;
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

// Types for insert/update operations
type ProfileUpdate = {
  first_name: string | null | undefined;
  last_name: string | null | undefined;
  phone: string | null | undefined;
};

type UserRoleInsert = {
  user_id: string;
  role: string;
};

const AdminUsersPage = () => {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      const { data } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      const rolesData = data as UserRoleData[] | null;

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

  const handleViewUser = (usr: User) => {
    setSelectedUser(usr);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditUser = (usr: User) => {
    setSelectedUser(usr);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleDeleteUser = (usr: User) => {
    setSelectedUser(usr);
    setShowDeleteDialog(true);
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    if (modalMode === 'edit' && selectedUser) {
      // Update user profile
      const profileUpdate: ProfileUpdate = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .eq('id', selectedUser.id);

      if (profileError) throw profileError;

      // Update user role if changed
      if (userData.role) {
        // Delete existing roles
        await supabase.from('user_roles').delete().eq('user_id', selectedUser.id);

        // Insert new role
        const roleInsert: UserRoleInsert = {
          user_id: selectedUser.id,
          role: userData.role,
        };

        await supabase.from('user_roles').insert(roleInsert as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    }

    // Refresh user list
    await fetchUsers();
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    // Delete user roles first
    await supabase.from('user_roles').delete().eq('user_id', selectedUser.id);

    // Note: Actual user deletion should be handled carefully
    // For now, we'll just show a placeholder
    // In production, you might want to soft-delete or restrict this operation

    await fetchUsers();
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
            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleAddUser}>
              Add User
            </Button>
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
                            usr.user_roles.map((role) => (
                              <Chip
                                key={`${usr.id}-${role.role}`}
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
                          <IconButton size="small" title="View" onClick={() => handleViewUser(usr)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Edit" onClick={() => handleEditUser(usr)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Delete" color="error" onClick={() => handleDeleteUser(usr)}>
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

      <UserModal
        open={showModal}
        user={selectedUser}
        mode={modalMode}
        onClose={() => setShowModal(false)}
        onSave={handleSaveUser}
      />

      <DeleteUserDialog
        open={showDeleteDialog}
        user={selectedUser}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </Layout>
  );
};

export default AdminUsersPage;
