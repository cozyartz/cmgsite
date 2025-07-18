import React, { useState, useEffect } from 'react';
import { apiService } from '../../lib/api';
import {
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  Target,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  TrendingUp,
  FileText,
  Link,
  Tag,
  Users,
  BarChart3,
  Zap,
  Globe,
  MessageSquare,
  Paperclip,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'keyword-research' | 'content-creation' | 'technical-seo' | 'link-building' | 'audit' | 'reporting' | 'analysis';
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  clientId: string;
  clientName: string;
  assignee: string;
  estimatedHours: number;
  actualHours: number;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  tags: string[];
  dependencies: string[];
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }>;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
  }>;
  deliverables: Array<{
    id: string;
    name: string;
    type: string;
    completed: boolean;
    url?: string;
  }>;
  metrics: {
    progress: number;
    completionRate: number;
    qualityScore: number;
  };
  createdAt: string;
  updatedAt: string;
}

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    loadTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filterStatus, filterType, filterPriority, searchTerm]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await apiService.call('/api/tasks', {
        requireAuth: true
      });
      setTasks(response.tasks || getDemoTasks());
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks(getDemoTasks());
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = tasks;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(task => task.type === filterType);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTasks(filtered);
  };

  const getDemoTasks = (): Task[] => [
    {
      id: '1',
      title: 'Keyword Research for Local SEO Campaign',
      description: 'Conduct comprehensive keyword research for local business targeting Michigan market. Focus on high-intent commercial keywords.',
      type: 'keyword-research',
      status: 'in-progress',
      priority: 'high',
      clientId: 'client-1',
      clientName: 'Local Business Co',
      assignee: 'Sarah Johnson',
      estimatedHours: 8,
      actualHours: 5.5,
      startDate: '2024-07-15',
      dueDate: '2024-07-18',
      tags: ['local-seo', 'keyword-research', 'michigan'],
      dependencies: [],
      attachments: [
        { id: 'att-1', name: 'keyword-brief.pdf', type: 'pdf', url: '/files/keyword-brief.pdf', size: 1024000 }
      ],
      comments: [
        { id: 'comm-1', author: 'Sarah Johnson', content: 'Initial research shows strong opportunity in local service keywords', timestamp: '2024-07-16T10:30:00Z' }
      ],
      deliverables: [
        { id: 'del-1', name: 'Primary Keywords List', type: 'spreadsheet', completed: true, url: '/deliverables/primary-keywords.xlsx' },
        { id: 'del-2', name: 'Long-tail Keywords Analysis', type: 'document', completed: false },
        { id: 'del-3', name: 'Competitor Keyword Gap Analysis', type: 'report', completed: false }
      ],
      metrics: {
        progress: 70,
        completionRate: 0.67,
        qualityScore: 8.5
      },
      createdAt: '2024-07-15T09:00:00Z',
      updatedAt: '2024-07-16T14:15:00Z'
    },
    {
      id: '2',
      title: 'Technical SEO Audit - Website Performance',
      description: 'Complete technical SEO audit focusing on Core Web Vitals, site structure, and crawlability issues.',
      type: 'technical-seo',
      status: 'todo',
      priority: 'urgent',
      clientId: 'client-2',
      clientName: 'E-commerce Startup',
      assignee: 'Mike Chen',
      estimatedHours: 12,
      actualHours: 0,
      startDate: '2024-07-18',
      dueDate: '2024-07-22',
      tags: ['technical-seo', 'audit', 'core-web-vitals'],
      dependencies: ['1'],
      attachments: [],
      comments: [],
      deliverables: [
        { id: 'del-4', name: 'Technical Audit Report', type: 'report', completed: false },
        { id: 'del-5', name: 'Priority Issues List', type: 'spreadsheet', completed: false },
        { id: 'del-6', name: 'Implementation Roadmap', type: 'document', completed: false }
      ],
      metrics: {
        progress: 0,
        completionRate: 0,
        qualityScore: 0
      },
      createdAt: '2024-07-14T11:00:00Z',
      updatedAt: '2024-07-14T11:00:00Z'
    },
    {
      id: '3',
      title: 'Blog Content Creation - 5 SEO Articles',
      description: 'Create 5 high-quality blog articles targeting primary keywords. Each article should be 1500+ words with proper optimization.',
      type: 'content-creation',
      status: 'review',
      priority: 'medium',
      clientId: 'client-3',
      clientName: 'SaaS Company',
      assignee: 'Emily Rodriguez',
      estimatedHours: 20,
      actualHours: 18,
      startDate: '2024-07-10',
      dueDate: '2024-07-17',
      tags: ['content-creation', 'blog', 'seo-writing'],
      dependencies: [],
      attachments: [
        { id: 'att-2', name: 'content-brief.docx', type: 'docx', url: '/files/content-brief.docx', size: 512000 },
        { id: 'att-3', name: 'brand-guidelines.pdf', type: 'pdf', url: '/files/brand-guidelines.pdf', size: 2048000 }
      ],
      comments: [
        { id: 'comm-2', author: 'Emily Rodriguez', content: 'First 3 articles completed and ready for review', timestamp: '2024-07-16T16:45:00Z' },
        { id: 'comm-3', author: 'Sarah Johnson', content: 'Great work! Minor revisions needed on article 2', timestamp: '2024-07-17T09:20:00Z' }
      ],
      deliverables: [
        { id: 'del-7', name: 'Article 1: SaaS Metrics Guide', type: 'article', completed: true, url: '/content/saas-metrics-guide.html' },
        { id: 'del-8', name: 'Article 2: Customer Acquisition', type: 'article', completed: true, url: '/content/customer-acquisition.html' },
        { id: 'del-9', name: 'Article 3: Retention Strategies', type: 'article', completed: true, url: '/content/retention-strategies.html' },
        { id: 'del-10', name: 'Article 4: Pricing Models', type: 'article', completed: false },
        { id: 'del-11', name: 'Article 5: Growth Hacking', type: 'article', completed: false }
      ],
      metrics: {
        progress: 85,
        completionRate: 0.6,
        qualityScore: 9.2
      },
      createdAt: '2024-07-08T14:30:00Z',
      updatedAt: '2024-07-17T09:20:00Z'
    },
    {
      id: '4',
      title: 'Monthly SEO Performance Report',
      description: 'Compile comprehensive monthly performance report including rankings, traffic, conversions, and recommendations.',
      type: 'reporting',
      status: 'completed',
      priority: 'medium',
      clientId: 'client-1',
      clientName: 'Local Business Co',
      assignee: 'David Kim',
      estimatedHours: 6,
      actualHours: 5.5,
      startDate: '2024-07-01',
      dueDate: '2024-07-05',
      completedDate: '2024-07-04',
      tags: ['reporting', 'analytics', 'monthly'],
      dependencies: [],
      attachments: [
        { id: 'att-4', name: 'july-report.pdf', type: 'pdf', url: '/reports/july-report.pdf', size: 3072000 }
      ],
      comments: [
        { id: 'comm-4', author: 'David Kim', content: 'Report completed with 23% traffic improvement highlighted', timestamp: '2024-07-04T17:30:00Z' }
      ],
      deliverables: [
        { id: 'del-12', name: 'Monthly Performance Report', type: 'report', completed: true, url: '/reports/july-performance.pdf' },
        { id: 'del-13', name: 'Executive Summary', type: 'document', completed: true, url: '/reports/july-summary.pdf' },
        { id: 'del-14', name: 'Next Month Strategy', type: 'document', completed: true, url: '/reports/august-strategy.pdf' }
      ],
      metrics: {
        progress: 100,
        completionRate: 1,
        qualityScore: 9.8
      },
      createdAt: '2024-06-28T10:00:00Z',
      updatedAt: '2024-07-04T17:30:00Z'
    }
  ];

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completedDate: newStatus === 'completed' ? new Date().toISOString() : undefined,
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'text-gray-400 bg-gray-500/20';
      case 'todo': return 'text-blue-400 bg-blue-500/20';
      case 'in-progress': return 'text-yellow-400 bg-yellow-500/20';
      case 'review': return 'text-purple-400 bg-purple-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'blocked': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'urgent': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword-research': return Search;
      case 'content-creation': return FileText;
      case 'technical-seo': return Zap;
      case 'link-building': return Link;
      case 'audit': return Target;
      case 'reporting': return BarChart3;
      case 'analysis': return TrendingUp;
      default: return FileText;
    }
  };

  const kanbanColumns = [
    { id: 'backlog', title: 'Backlog', status: 'backlog' },
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'review', title: 'Review', status: 'review' },
    { id: 'completed', title: 'Completed', status: 'completed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className={`flex justify-between items-center mb-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
              SEO Task Management
            </h1>
            <p className="text-slate-300">Streamline your SEO workflows and client deliverables</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'kanban' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'calendar' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <TaskStatCard
            title="Total Tasks"
            value={tasks.length.toString()}
            icon={Target}
            color="teal"
          />
          <TaskStatCard
            title="In Progress"
            value={tasks.filter(t => t.status === 'in-progress').length.toString()}
            icon={Play}
            color="yellow"
          />
          <TaskStatCard
            title="Completed"
            value={tasks.filter(t => t.status === 'completed').length.toString()}
            icon={CheckCircle}
            color="green"
          />
          <TaskStatCard
            title="Overdue"
            value={tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length.toString()}
            icon={AlertCircle}
            color="red"
          />
          <TaskStatCard
            title="Avg Quality"
            value={`${(tasks.reduce((sum, t) => sum + t.metrics.qualityScore, 0) / tasks.length || 0).toFixed(1)}/10`}
            icon={Star}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className={`bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 mb-8 transform transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Types</option>
              <option value="keyword-research">Keyword Research</option>
              <option value="content-creation">Content Creation</option>
              <option value="technical-seo">Technical SEO</option>
              <option value="link-building">Link Building</option>
              <option value="audit">Audit</option>
              <option value="reporting">Reporting</option>
              <option value="analysis">Analysis</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <button
              onClick={loadTasks}
              className="bg-slate-600/50 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Task Views */}
        <div className={`transform transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {viewMode === 'kanban' && (
            <KanbanBoard
              tasks={filteredTasks}
              columns={kanbanColumns}
              onUpdateStatus={updateTaskStatus}
              onTaskClick={setSelectedTask}
            />
          )}

          {viewMode === 'list' && (
            <TaskList
              tasks={filteredTasks}
              onUpdateStatus={updateTaskStatus}
              onTaskClick={setSelectedTask}
            />
          )}

          {viewMode === 'calendar' && (
            <TaskCalendar
              tasks={filteredTasks}
              onTaskClick={setSelectedTask}
            />
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            setTasks(prev =>
              prev.map(task => task.id === updatedTask.id ? updatedTask : task)
            );
            setSelectedTask(updatedTask);
          }}
        />
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(newTask) => {
            setTasks(prev => [...prev, { ...newTask, id: Date.now().toString() }]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

// Task Stat Card Component
interface TaskStatCardProps {
  title: string;
  value: string;
  icon: any;
  color: 'teal' | 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

const TaskStatCard: React.FC<TaskStatCardProps> = ({ title, value, icon: Icon, color }) => {
  const colors = {
    teal: 'text-teal-400 bg-teal-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20',
    red: 'text-red-400 bg-red-500/20'
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colors[color]} rounded-lg`}>
          <Icon className={`h-6 w-6 ${colors[color].split(' ')[0]}`} />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{title}</div>
    </div>
  );
};

// Kanban Board Component
interface KanbanBoardProps {
  tasks: Task[];
  columns: Array<{ id: string; title: string; status: string }>;
  onUpdateStatus: (taskId: string, newStatus: Task['status']) => void;
  onTaskClick: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, columns, onUpdateStatus, onTaskClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {columns.map(column => {
        const columnTasks = tasks.filter(task => task.status === column.status);
        
        return (
          <div key={column.id} className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{column.title}</h3>
              <span className="bg-slate-600/50 text-slate-300 text-sm px-2 py-1 rounded-full">
                {columnTasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {columnTasks.map(task => (
                <KanbanTaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task)}
                  onStatusChange={(newStatus) => onUpdateStatus(task.id, newStatus)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Kanban Task Card Component
interface KanbanTaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange: (newStatus: Task['status']) => void;
}

const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({ task, onClick, onStatusChange }) => {
  const TypeIcon = getTypeIcon(task.type);
  
  return (
    <div
      onClick={onClick}
      className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TypeIcon className="h-4 w-4 text-teal-400" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        <Flag className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
      </div>

      {/* Title */}
      <h4 className="text-white font-medium mb-2 group-hover:text-teal-200 transition-colors duration-300">
        {task.title}
      </h4>

      {/* Client */}
      <p className="text-slate-400 text-sm mb-3">{task.clientName}</p>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Progress</span>
          <span className="text-slate-300">{task.metrics.progress}%</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-teal-500 to-teal-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${task.metrics.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3" />
          <span>{task.actualHours}h / {task.estimatedHours}h</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageSquare className="h-3 w-3" />
          <span>{task.comments.length}</span>
        </div>
      </div>

      {/* Due Date */}
      <div className="mt-2 text-xs">
        <span className={`${new Date(task.dueDate) < new Date() ? 'text-red-400' : 'text-slate-400'}`}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

// Task List Component
interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, newStatus: Task['status']) => void;
  onTaskClick: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateStatus, onTaskClick }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Task</th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Client</th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Type</th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Priority</th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Progress</th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium">Due Date</th>
              <th className="text-right py-4 px-6 text-slate-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const TypeIcon = getTypeIcon(task.type);
              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
              
              return (
                <tr
                  key={task.id}
                  className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200 cursor-pointer"
                  onClick={() => onTaskClick(task)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <TypeIcon className="h-5 w-5 text-teal-400" />
                      <div>
                        <div className="text-white font-medium">{task.title}</div>
                        <div className="text-sm text-slate-400">{task.assignee}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-300">{task.clientName}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-slate-600/50 text-slate-300 text-sm rounded-md capitalize">
                      {task.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-teal-400 h-2 rounded-full"
                          style={{ width: `${task.metrics.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-300">{task.metrics.progress}%</span>
                    </div>
                  </td>
                  <td className={`py-4 px-6 ${isOverdue ? 'text-red-400' : 'text-slate-300'}`}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-white transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 transition-colors duration-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Task Calendar Component (simplified for now)
interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onTaskClick }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Calendar View</h3>
        <p className="text-slate-400">Calendar view coming soon with drag & drop functionality</p>
      </div>
    </div>
  );
};

// Task Detail Modal Component (simplified)
interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onUpdate }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold text-white">{task.title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Task Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Task Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Description</label>
                  <p className="text-white mt-1">{task.description}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Client</label>
                  <p className="text-white mt-1">{task.clientName}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Assignee</label>
                  <p className="text-white mt-1">{task.assignee}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Progress</label>
                  <div className="mt-2">
                    <div className="w-full bg-slate-600 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-teal-400 h-3 rounded-full"
                        style={{ width: `${task.metrics.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-white text-sm mt-1">{task.metrics.progress}% Complete</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Deliverables</h3>
              <div className="space-y-3">
                {task.deliverables.map(deliverable => (
                  <div key={deliverable.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {deliverable.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-slate-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">{deliverable.name}</p>
                        <p className="text-slate-400 text-sm">{deliverable.type}</p>
                      </div>
                    </div>
                    {deliverable.url && (
                      <button className="text-teal-400 hover:text-teal-300 transition-colors duration-200">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>
            <div className="space-y-4">
              {task.comments.map(comment => (
                <div key={comment.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{comment.author}</span>
                    <span className="text-slate-400 text-sm">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create Task Modal Component (simplified)
interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (task: Partial<Task>) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'keyword-research' as Task['type'],
    priority: 'medium' as Task['priority'],
    clientName: '',
    assignee: '',
    estimatedHours: 8,
    dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      status: 'backlog',
      clientId: 'new-client',
      actualHours: 0,
      startDate: new Date().toISOString().split('T')[0],
      tags: [],
      dependencies: [],
      attachments: [],
      comments: [],
      deliverables: [],
      metrics: {
        progress: 0,
        completionRate: 0,
        qualityScore: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-slate-300 font-medium mb-2">Task Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Task['type'] })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="keyword-research">Keyword Research</option>
                <option value="content-creation">Content Creation</option>
                <option value="technical-seo">Technical SEO</option>
                <option value="link-building">Link Building</option>
                <option value="audit">Audit</option>
                <option value="reporting">Reporting</option>
                <option value="analysis">Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Client</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Assignee</label>
              <input
                type="text"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Estimated Hours</label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-600/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all duration-300 hover:scale-105"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'backlog': return 'text-gray-400 bg-gray-500/20';
    case 'todo': return 'text-blue-400 bg-blue-500/20';
    case 'in-progress': return 'text-yellow-400 bg-yellow-500/20';
    case 'review': return 'text-purple-400 bg-purple-500/20';
    case 'completed': return 'text-green-400 bg-green-500/20';
    case 'blocked': return 'text-red-400 bg-red-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low': return 'text-blue-400';
    case 'medium': return 'text-yellow-400';
    case 'high': return 'text-orange-400';
    case 'urgent': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'keyword-research': return Search;
    case 'content-creation': return FileText;
    case 'technical-seo': return Zap;
    case 'link-building': return Link;
    case 'audit': return Target;
    case 'reporting': return BarChart3;
    case 'analysis': return TrendingUp;
    default: return FileText;
  }
};

export default TaskManagement;