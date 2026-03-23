'use client'

import React from 'react';
import { isOverdue } from '../utils/dateUtils';
import { api } from '../services/api';

export default function TaskItem({ task, onStatusUpdate }) {
  const handleStatusToggle = async () => {
    const newStatus = task.status === 'pending' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'pending';
    try {
      await api.updateTaskStatus(task.id, newStatus);
      onStatusUpdate(task.id, newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className={`p-4 border rounded-lg mb-4 shadow-sm ${
      overdue ? 'border-red-500 bg-red-50' : task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {task.priority}
        </span>
      </div>
      {task.description && <p className="text-gray-600 mb-3">{task.description}</p>}
      <div className="flex justify-between items-center text-sm">
        <span className={`px-2 py-1 rounded ${
          task.status === 'completed' ? 'bg-green-100 text-green-800' : task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {task.status.replace('_', ' ')}
        </span>
        <span className={overdue ? 'text-red-600 font-semibold' : 'text-gray-500'}>
          {new Date(task.due_date).toLocaleDateString()}
        </span>
      </div>
      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
        task.category === 'tax' ? 'bg-blue-100 text-blue-800' : task.category === 'audit' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
      }`}>
        {task.category}
      </span>
      <button
        onClick={handleStatusToggle}
        className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        {task.status === 'completed' ? 'Reopen' : 'Mark ' + (task.status === 'pending' ? 'In Progress' : 'Completed')}
      </button>
    </div>
  );
}

