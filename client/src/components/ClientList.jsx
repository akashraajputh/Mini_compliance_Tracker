 'use client'

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
 
export default function ClientList({ onSelectClient }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    api.getClients().then(data => {
      setClients(data);
      setLoading(false);
      if (data.length > 0) onSelectClient(data[0].id);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
 
  if (loading) return <div className="text-gray-500">Loading clients...</div>;
 
  return (
    <div className="w-64 bg-gray-100 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Clients</h2>
      <ul className="space-y-2">
        {clients.map(client => (
          <li key={client.id}>
            <button 
              onClick={() => onSelectClient(client.id)}
              className="w-full text-left p-3 bg-white rounded hover:bg-gray-200 transition"
            >
              <div className="font-semibold">{client.company_name}</div>
              <div className="text-sm text-gray-500">{client.country} - {client.entity_type}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
