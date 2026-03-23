'use client'

import { useState } from 'react';
import ClientList from '../components/ClientList';
import TaskList from '../components/TaskList';

export default function Home() {
  const [selectedClientId, setSelectedClientId] = useState(null);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Compliance Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage compliance tasks for your clients
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ClientList onSelectClient={setSelectedClientId} />
          <div className="lg:col-span-3">
            <TaskList clientId={selectedClientId} />
          </div>
        </div>
      </div>
    </main>
  );
}

