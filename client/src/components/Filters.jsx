'use client'

import React from 'react';
import { STATUS, CATEGORIES } from '../constants/enums';

export default function Filters({ onFilterChange }) {
  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value, category: '' });
  };

  const handleCategoryChange = (e) => {
    onFilterChange({ status: '', category: e.target.value });
  };

  return (
    <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select onChange={handleStatusChange} className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select onChange={handleCategoryChange} className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

