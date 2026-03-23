'use client'

import React, { useState } from 'react';
import { CATEGORIES, PRIORITIES } from '../constants/enums';
import { api } from '../services/api';

export default function AddTaskForm({ clientId, onTaskAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tax',
    due_date: '',
    priority: 'medium'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createTask({ ...formData, client_id: clientId });
      setFormData({ title: '', description: '', category: 'tax', due_date: '', priority: 'medium' });
      onTaskAdded();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border mb-6">
      <h3 className="text-xl font-bold mb-4">Add New Task</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <input
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {PRIORITIES.map(p => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description (optional)"
        rows="3"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="mt-4 w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition font-semibold"
      >
        Add Task
      </button>
    </form>
  );
}

