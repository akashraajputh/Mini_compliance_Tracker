const API_BASE = 'http://localhost:3001/api';

export const api = {
  getClients: () => fetch(`${API_BASE}/clients`).then(res => res.json()),
  getTasks: (clientId) => fetch(`${API_BASE}/tasks/${clientId}`).then(res => res.json()),
  createTask: (task) => fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }).then(res => res.json()),
  updateTaskStatus: (id, status) => fetch(`${API_BASE}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(res => res.json())
};
