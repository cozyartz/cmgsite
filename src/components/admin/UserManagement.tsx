import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  CreditCard,
  ArrowUpDown,
  Download,
  MoreHorizontal,
  Shield,
  AlertTriangle,
  UserCheck,
  Eye,
  Settings,
  RefreshCw,
  Crown,
  Zap,
  MessageCircle,
  UserCog,
  Lock,
  Unlock
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastLogin: string;
  status: 'active' | 'suspended' | 'pending' | 'cancelled';
  plan: 'starter' | 'growth' | 'enterprise';
  totalSpent: number;
  aiCallsUsed: number;
  aiCallsLimit: number;
  provider: 'github' | 'google' | 'email';
  avatar?: string;
}

interface UserManagementProps {
  isVisible: boolean;
}

const UserManagement: React.FC<UserManagementProps> = ({ isVisible }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [sortBy, setSortBy] = useState('joinDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showImpersonateModal, setShowImpersonateModal] = useState(false);
  const [impersonateUser, setImpersonateUser] = useState<User | null>(null);

  useEffect(() => {
    if (isVisible) {
      loadUsers();
    }
  }, [isVisible]);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, statusFilter, planFilter, sortBy, sortOrder]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Mock user data - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@techstartup.com',
          joinDate: '2024-01-15',
          lastLogin: '2024-01-16 14:30',
          status: 'active',
          plan: 'growth',
          totalSpent: 599.97,
          aiCallsUsed: 456,
          aiCallsLimit: 1000,
          provider: 'github',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike@designagency.com',
          joinDate: '2024-01-14',
          lastLogin: '2024-01-16 09:15',
          status: 'active',
          plan: 'enterprise',
          totalSpent: 1299.99,
          aiCallsUsed: 2340,
          aiCallsLimit: 5000,
          provider: 'google'
        },
        {
          id: '3',
          name: 'Lisa Rodriguez',
          email: 'lisa@consulting.com',
          joinDate: '2024-01-13',
          lastLogin: '2024-01-15 16:45',
          status: 'pending',
          plan: 'starter',
          totalSpent: 0,
          aiCallsUsed: 0,
          aiCallsLimit: 100,
          provider: 'email'
        },
        {
          id: '4',
          name: 'David Kumar',
          email: 'david@marketing.co',
          joinDate: '2024-01-12',
          lastLogin: '2024-01-16 11:20',
          status: 'active',
          plan: 'growth',
          totalSpent: 299.97,
          aiCallsUsed: 234,
          aiCallsLimit: 1000,
          provider: 'github'
        },
        {
          id: '5',
          name: 'Emma Wilson',
          email: 'emma@freelance.dev',
          joinDate: '2024-01-10',
          lastLogin: '2024-01-14 08:30',
          status: 'suspended',
          plan: 'starter',
          totalSpent: 89.99,
          aiCallsUsed: 67,
          aiCallsLimit: 100,
          provider: 'email'
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesPlan = planFilter === 'all' || user.plan === planFilter;
      
      return matchesSearch && matchesStatus && matchesPlan;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof User];
      let bValue: any = b[sortBy as keyof User];
      
      if (sortBy === 'totalSpent') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === 'joinDate' || sortBy === 'lastLogin') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    try {
      // Mock API call
      console.log(`${action} user ${userId}`);
      
      setUsers(users.map(user => {
        if (user.id === userId) {
          if (action === 'suspend') return { ...user, status: 'suspended' as const };
          if (action === 'activate') return { ...user, status: 'active' as const };
          if (action === 'delete') return user; // In real app, remove from list
        }
        return user;
      }));
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  const handleImpersonateUser = async (user: User) => {
    setImpersonateUser(user);
    setShowImpersonateModal(true);
  };

  const confirmImpersonation = async () => {
    if (!impersonateUser) return;
    
    try {
      // In real implementation, this would:
      // 1. Log the impersonation for audit trail
      // 2. Create a special admin session
      // 3. Switch to user's account with admin privileges
      console.log('Impersonating user:', impersonateUser.email);
      
      // Mock implementation - would redirect to user's dashboard
      alert(`Impersonation started! You are now viewing as ${impersonateUser.name}. This session is logged for security.`);
      
      setShowImpersonateModal(false);
      setImpersonateUser(null);
    } catch (error) {
      console.error('Error starting impersonation:', error);
      alert('Failed to start impersonation. Please try again.');
    }
  };

  const handleBulkAction = async (action: 'email' | 'role_change' | 'suspend' | 'activate' | 'export') => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    try {
      switch (action) {
        case 'email':
          const subject = prompt('Email subject:');
          const message = prompt('Email message:');
          if (subject && message) {
            console.log(`Sending email to ${selectedUsers.length} users:`, { subject, message });
            alert(`Email sent to ${selectedUsers.length} users!`);
          }
          break;
          
        case 'role_change':
          const newRole = prompt('New role (starter/growth/enterprise):');
          if (newRole && ['starter', 'growth', 'enterprise'].includes(newRole)) {
            setUsers(users.map(user => 
              selectedUsers.includes(user.id) 
                ? { ...user, plan: newRole as 'starter' | 'growth' | 'enterprise' }
                : user
            ));
            alert(`Changed role for ${selectedUsers.length} users to ${newRole}`);
          }
          break;
          
        case 'suspend':
          setUsers(users.map(user => 
            selectedUsers.includes(user.id) 
              ? { ...user, status: 'suspended' as const }
              : user
          ));
          alert(`Suspended ${selectedUsers.length} users`);
          break;
          
        case 'activate':
          setUsers(users.map(user => 
            selectedUsers.includes(user.id) 
              ? { ...user, status: 'active' as const }
              : user
          ));
          alert(`Activated ${selectedUsers.length} users`);
          break;
          
        case 'export':
          const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
          const csvData = [
            'Name,Email,Status,Plan,Total Spent,AI Calls Used,Last Login',
            ...selectedUserData.map(user => 
              `"${user.name}","${user.email}","${user.status}","${user.plan}","${user.totalSpent}","${user.aiCallsUsed}","${user.lastLogin}"`
            )
          ].join('\n');
          
          const blob = new Blob([csvData], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `selected_users_${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          break;
      }
      
      setSelectedUsers([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error(`Error performing bulk action ${action}:`, error);
      alert('Failed to perform bulk action. Please try again.');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'suspended': return 'text-red-400 bg-red-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'text-blue-400 bg-blue-400/20';
      case 'growth': return 'text-purple-400 bg-purple-400/20';
      case 'enterprise': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="ml-3 text-lg text-white">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Crown className="h-7 w-7 mr-2 text-purple-400" />
            SuperAdmin User Management
          </h2>
          <p className="text-slate-300 mt-1">
            {filteredUsers.length} of {users.length} users
            {selectedUsers.length > 0 && (
              <span className="ml-3 text-purple-400">
                • {selectedUsers.length} selected
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
              >
                <Zap className="h-4 w-4" />
                <span>Bulk Actions ({selectedUsers.length})</span>
              </button>
            </div>
          )}
          <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
          <button 
            onClick={() => handleBulkAction('export')}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions Menu */}
      {showBulkActions && selectedUsers.length > 0 && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-purple-300 font-semibold flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Bulk Actions - {selectedUsers.length} users selected
            </h3>
            <button 
              onClick={() => setShowBulkActions(false)}
              className="text-purple-400 hover:text-purple-300"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button 
              onClick={() => handleBulkAction('email')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-all"
            >
              <Mail className="h-4 w-4" />
              <span>Send Email</span>
            </button>
            <button 
              onClick={() => handleBulkAction('role_change')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-all"
            >
              <UserCog className="h-4 w-4" />
              <span>Change Role</span>
            </button>
            <button 
              onClick={() => handleBulkAction('suspend')}
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-all"
            >
              <Lock className="h-4 w-4" />
              <span>Suspend</span>
            </button>
            <button 
              onClick={() => handleBulkAction('activate')}
              className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-all"
            >
              <Unlock className="h-4 w-4" />
              <span>Activate</span>
            </button>
            <button 
              onClick={() => handleBulkAction('export')}
              className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Plans</option>
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <select
            value={`${sortBy}_${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('_');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="joinDate_desc">Newest First</option>
            <option value="joinDate_asc">Oldest First</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
            <option value="totalSpent_desc">Highest Spent</option>
            <option value="totalSpent_asc">Lowest Spent</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-600/50">
              <tr>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={selectAllUsers}
                    className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">User</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Plan</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Usage</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Revenue</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Last Login</th>
                <th className="text-right py-4 px-6 text-slate-300 font-medium">SuperAdmin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-slate-700/20 transition-colors ${selectedUsers.includes(user.id) ? 'bg-purple-900/20' : ''}`}>
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                        <p className="text-slate-500 text-xs">{user.provider}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(user.plan)}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{user.aiCallsUsed} / {user.aiCallsLimit}</span>
                        <span className="text-slate-400">{Math.round((user.aiCallsUsed / user.aiCallsLimit) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div 
                          className="bg-teal-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((user.aiCallsUsed / user.aiCallsLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white font-medium">{formatCurrency(user.totalSpent)}</p>
                    <p className="text-slate-400 text-sm">Total spent</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-slate-300 text-sm">{new Date(user.lastLogin).toLocaleDateString()}</p>
                    <p className="text-slate-500 text-xs">{new Date(user.lastLogin).toLocaleTimeString()}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-1">
                      {/* SuperAdmin Impersonation Button */}
                      <button 
                        onClick={() => handleImpersonateUser(user)}
                        className="text-purple-400 hover:text-purple-300 p-1 rounded transition-colors bg-purple-900/20 hover:bg-purple-900/40"
                        title="🚨 SuperAdmin: Login as User"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      
                      <button 
                        className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                        title="Send Email"
                        onClick={() => {
                          const message = prompt(`Send email to ${user.name}:`);
                          if (message) alert(`Email sent to ${user.email}: ${message}`);
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      
                      {user.status === 'active' ? (
                        <button 
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          className="text-yellow-400 hover:text-yellow-300 p-1 rounded transition-colors"
                          title="Suspend User"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUserAction(user.id, 'activate')}
                          className="text-green-400 hover:text-green-300 p-1 rounded transition-colors"
                          title="Activate User"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-600/50 p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">User Details</h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Name</label>
                  <p className="text-white font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Email</label>
                  <p className="text-white">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Plan</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(selectedUser.plan)}`}>
                    {selectedUser.plan}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Total Spent</label>
                  <p className="text-white font-medium">{formatCurrency(selectedUser.totalSpent)}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">AI Usage</label>
                  <p className="text-white">{selectedUser.aiCallsUsed} / {selectedUser.aiCallsLimit} calls</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Impersonation Confirmation Modal */}
      {showImpersonateModal && impersonateUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-red-500/50 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-red-400 flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                SuperAdmin Impersonation
              </h3>
              <button 
                onClick={() => setShowImpersonateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-400 font-semibold">Security Warning</h4>
                    <p className="text-red-300 text-sm mt-1">
                      You are about to impersonate <strong>{impersonateUser.name}</strong> ({impersonateUser.email}).
                      This action will be logged for security and compliance purposes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">User:</span>
                  <span className="text-white">{impersonateUser.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white">{impersonateUser.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Plan:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPlanColor(impersonateUser.plan)}`}>
                    {impersonateUser.plan}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(impersonateUser.status)}`}>
                    {impersonateUser.status}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowImpersonateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmImpersonation}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors flex items-center justify-center space-x-2"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Start Impersonation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;