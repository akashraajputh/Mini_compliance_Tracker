const { db, sqliteAvailable } = require('../config/database');

const TaskModel = {
  getByClientId: (clientId) => {
    if (sqliteAvailable) {
      return db.conn.prepare('SELECT * FROM tasks WHERE client_id = ? ORDER BY due_date ASC').all(clientId);
    }
    const data = db.load();
    return (data.tasks || []).filter((task) => task.client_id === clientId).sort((a, b) => (a.due_date > b.due_date ? 1 : -1));
  },
  create: ({ client_id, title, description, category, due_date, priority = 'medium' }) => {
    if (sqliteAvailable) {
      return db.conn.prepare('INSERT INTO tasks (client_id, title, description, category, due_date, priority) VALUES (?, ?, ?, ?, ?, ?)').run(client_id, title, description, category, due_date, priority);
    }
    const data = db.load();
    data.tasks = data.tasks || [];
    const maxId = data.tasks.reduce((max, task) => Math.max(max, task.id || 0), 0);
    const task = {
      id: maxId + 1,
      client_id,
      title,
      description,
      category,
      due_date,
      status: 'pending',
      priority
    };
    data.tasks.push(task);
    db.save(data);
    return task;
  },
  updateStatus: (id, status) => {
    if (sqliteAvailable) {
      return db.conn.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, id);
    }
    const data = db.load();
    const task = data.tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    task.status = status;
    db.save(data);
    return task;
  },
  seedIfEmpty: (clientId) => {
    if (sqliteAvailable) {
      const count = db.conn.prepare('SELECT COUNT(*) as count FROM tasks WHERE client_id = ?').get(clientId).count;
      if (count === 0) {
        const stmt = db.conn.prepare('INSERT INTO tasks (client_id, title, description, category, due_date, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?)');
        stmt.run(clientId, 'Annual Tax Filing', 'File IRS Form 1120', 'tax', '2024-10-01', 'pending', 'high');
        stmt.run(clientId, 'VAT Return', 'Submit Q4 VAT', 'tax', '2024-12-15', 'pending', 'medium');
        stmt.run(clientId, 'Audit Prep', 'Prepare for external audit', 'audit', '2024-11-30', 'in-progress', 'high');
        console.log('Seeded tasks for client');
      }
      return;
    }
    const data = db.load();
    data.tasks = data.tasks || [];
    const existingForClient = data.tasks.filter((t) => t.client_id === clientId);
    if (existingForClient.length === 0) {
      const maxId = data.tasks.reduce((max, task) => Math.max(max, task.id || 0), 0);
      data.tasks.push({ id: maxId + 1, client_id: clientId, title: 'Annual Tax Filing', description: 'File IRS Form 1120', category: 'tax', due_date: '2024-10-01', status: 'pending', priority: 'high' });
      data.tasks.push({ id: maxId + 2, client_id: clientId, title: 'VAT Return', description: 'Submit Q4 VAT', category: 'tax', due_date: '2024-12-15', status: 'pending', priority: 'medium' });
      data.tasks.push({ id: maxId + 3, client_id: clientId, title: 'Audit Prep', description: 'Prepare for external audit', category: 'audit', due_date: '2024-11-30', status: 'in-progress', priority: 'high' });
      db.save(data);
      console.log('Seeded tasks for client (JSON DB)');
    }
  }
};

module.exports = TaskModel;
