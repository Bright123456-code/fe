import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Layout/Sidebar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Spinner } from '../../components/common/Spinner';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { UserPlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', {
        params: { page: pagination.page, limit: 20, search },
      });
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (error) {
      showError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      if (selectedUser) {
        await api.patch(`/users/${selectedUser._id}`, formData);
        success('User updated successfully');
      } else {
        await api.post('/auth/signup', formData);
        success('User created successfully');
      }
      setShowModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      showError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;

    try {
      await api.delete(`/users/${userId}`);
      success('User deactivated successfully');
      fetchUsers();
    } catch (error) {
      showError('Failed to deactivate user');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-500 mt-1">Manage staff accounts and permissions</p>
          </div>
          <Button
            onClick={() => {
              setSelectedUser(null);
              setShowModal(true);
            }}
          >
            <UserPlusIcon className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card>
          <div className="mb-4">
            <Input
              placeholder="Search by name, email, or employee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">User</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Employee ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Face Enrolled</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{user.employeeId || '-'}</td>
                        <td className="py-3 px-4">
                          <span className="capitalize">{user.role}</span>
                        </td>
                        <td className="py-3 px-4">
                          {user.isFaceEnrolled ? (
                            <span className="text-emerald-600 text-sm">Yes</span>
                          ) : (
                            <span className="text-amber-600 text-sm">No</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowModal(true);
                              }}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <TrashIcon className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Showing {users.length} of {pagination.total} users
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </main>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleCreateUser}
          onCancel={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      </Modal>
    </div>
  );
};

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'staff',
    department: user?.department || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
        required
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
        required
      />
      {!user && (
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
          required={!user}
        />
      )}
      <div>
        <label className="label">Role</label>
        <select
          className="input"
          value={formData.role}
          onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <Input
        label="Department"
        value={formData.department}
        onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
      />
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {user ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
