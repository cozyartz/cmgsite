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
  AlertTriangle
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
            <Users className="h-7 w-7 mr-2 text-teal-400" />
            User Management
          </h2>
          <p className="text-slate-300 mt-1">{filteredUsers.length} of {users.length} users</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

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
                <th className="text-left py-4 px-6 text-slate-300 font-medium">User</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Plan</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Usage</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Revenue</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Last Login</th>
                <th className="text-right py-4 px-6 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
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
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <Edit3 className="h-4 w-4" />
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
    </div>
  );
};

export default UserManagement;