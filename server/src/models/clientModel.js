const { db, sqliteAvailable } = require('../config/database');

const ClientModel = {
  getAll: () => {
    if (sqliteAvailable) {
      return db.conn.prepare('SELECT * FROM clients').all();
    }
    const data = db.load();
    return data.clients;
  },
  seedIfEmpty: () => {
    if (sqliteAvailable) {
      const count = db.conn.prepare('SELECT COUNT(*) as count FROM clients').get().count;
      if (count === 0) {
        const stmt = db.conn.prepare('INSERT INTO clients (company_name, country, entity_type) VALUES (?, ?, ?)');
        stmt.run('Ledgers Inc', 'US', 'LLC');
        stmt.run('Acme Corp', 'UK', 'Ltd');
        stmt.run('Global Tech', 'CA', 'Corp');
        console.log('Seeded clients');
      }
      return;
    }
    const data = db.load();
    if (!data.clients || data.clients.length === 0) {
      data.clients = [
        { id: 1, company_name: 'Ledgers Inc', country: 'US', entity_type: 'LLC' },
        { id: 2, company_name: 'Acme Corp', country: 'UK', entity_type: 'Ltd' },
        { id: 3, company_name: 'Global Tech', country: 'CA', entity_type: 'Corp' }
      ];
      data.tasks = data.tasks || [];
      db.save(data);
      console.log('Seeded clients in JSON DB');
    }
  }
};

module.exports = ClientModel;
