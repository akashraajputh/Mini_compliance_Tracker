const db = require('../config/database');

const TaskModel = {
  getByClientId: (clientId) => {
    return db.prepare(`
      SELECT * FROM tasks WHERE client_id = ? ORDER BY due_date ASC
    `).all(clientId);
  },
  create: ({ client_id, title, description, category, due_date, priority = 'medium' }) => {
    return db.prepare(`
      INSERT INTO tasks (client_id, title, description, category, due_date, priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(client_id, title, description, category, due_date, priority);
  },
  updateStatus: (id, status) => {
    return db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, id);
  },
  seedIfEmpty: (clientId) => {
    const count = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE client_id = ?').get(clientId).count;
    if (count === 0) {
      const stmt = db.prepare(`
        INSERT INTO tasks (client_id, title, description, category, due_date, status, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      // Overdue sample
      stmt.run(clientId, 'Annual Tax Filing', 'File IRS Form 1120', 'tax', '2024-10-01', 'pending', 'high');
      stmt.run(clientId, 'VAT Return', 'Submit Q4 VAT', 'tax', '2024-12-15', 'pending', 'medium');
      stmt.run(clientId, 'Audit Prep', 'Prepare for external audit', 'audit', '2024-11-30', 'in-progress', 'high');
      console.log('Seeded tasks for client');
    }
  }
};

module.exports = TaskModel;
