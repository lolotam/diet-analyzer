import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database;

export async function initDB() {
  db = await open({
    filename: path.join(__dirname, '../diet.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_path TEXT,
      food_name TEXT,
      calories INTEGER,
      protein TEXT,
      carbs TEXT,
      fats TEXT,
      analysis TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Database initialized');
  return db;
}

export function getDB() {
  return db;
}