const db = require('../config/database');

const ClientModel = {
  getAll: () => {
    return db.prepare('SELECT * FROM clients').all();
  },
  seedIfEmpty: () => {
    const count = db.prepare('SELECT COUNT(*) as count FROM clients').get().count;
    if (count === 0) {
      const stmt = db.prepare(`
        INSERT INTO clients (company_name, country, entity_type) VALUES (?, ?, ?)
      `);
      stmt.run('Ledgers Inc', 'US', 'LLC');
      stmt.run('Acme Corp', 'UK', 'Ltd');
      stmt.run('Global Tech', 'CA', 'Corp');
      console.log('Seeded clients');
    }
  }
};

module.exports = ClientModel;
