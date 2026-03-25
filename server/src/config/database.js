const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '../../database.json');

function loadJson() {
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ clients: [], tasks: [] }, null, 2));
  }
  const raw = fs.readFileSync(dbFile, 'utf8');
  return JSON.parse(raw);
}

function saveJson(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

let db;
let sqliteAvailable = false;

try {
  const Database = require('better-sqlite3');
  const sqlitePath = process.env.DB_PATH || path.join(__dirname, '../../database.db');
  const sqlite = new Database(sqlitePath);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      country TEXT NOT NULL,
      entity_type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      FOREIGN KEY (client_id) REFERENCES clients (id)
    );
  `);

  db = { type: 'sqlite', conn: sqlite };
  sqliteAvailable = true;
  console.log('Using better-sqlite3 database');
} catch (err) {
  console.warn('better-sqlite3 unavailable or failed; using JSON fallback DB.', err.message);
  db = {
    type: 'json',
    load: loadJson,
    save: saveJson
  };
}

module.exports = { db, sqliteAvailable };
