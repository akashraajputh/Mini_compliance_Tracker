'use client'

import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import Filters from './Filters';
import { api } from '../services/api';
import { isOverdue } from '../utils/dateUtils';

export default function TaskList({ clientId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('due_date');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (clientId) {
      setLoading(true);
      api.getTasks(clientId).then(data => {
        setTasks(data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [clientId, refreshTrigger]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.category && task.category !== filters.category) return false;
    if (search && !task.title.toLowerCase().includes(search.toLowerCase()) && !task.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'due_date') {
      return new Date(a.due_date) - new Date(b.due_date);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'status') {
      const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return 0;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => isOverdue(t.due_date, t.status)).length
  };

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleStatusUpdate = (taskId, newStatus) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
  };

  if (!clientId) return <div className="text-gray-500">Select a client to view tasks</div>;

  if (loading) return <div className="text-gray-500">Loading tasks...</div>;

  return (
    <div className="flex-1">
      <div className="flex gap-6">
        <div className="w-1/4">
          {/* ClientList will be in page */}
        </div>
        <div className="w-3/4">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Summary Stats</h3>
            <div className="flex gap-4">
              <span>Total Tasks: {stats.total}</span>
              <span>Pending: {stats.pending}</span>
              <span>Overdue: {stats.overdue}</span>
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 flex-1"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="due_date">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
          <Filters onFilterChange={handleFilterChange} />
          <AddTaskForm clientId={clientId} onTaskAdded={handleTaskAdded} />
          <div className="space-y-4">
            {sortedTasks.map(task => (
              <TaskItem key={task.id} task={task} onStatusUpdate={handleStatusUpdate} />
            ))}
          </div>
          {sortedTasks.length === 0 && (
            <div className="text-gray-500 text-center py-12">
              No tasks match the selected filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

