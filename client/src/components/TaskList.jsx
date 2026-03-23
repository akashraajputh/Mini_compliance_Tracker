'use client'

import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import Filters from './Filters';
import { api } from '../services/api';

export default function TaskList({ clientId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '' });
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
    return true;
  });

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
          <Filters onFilterChange={handleFilterChange} />
          <AddTaskForm clientId={clientId} onTaskAdded={handleTaskAdded} />
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} onStatusUpdate={handleStatusUpdate} />
            ))}
          </div>
          {filteredTasks.length === 0 && (
            <div className="text-gray-500 text-center py-12">
              No tasks match the selected filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

