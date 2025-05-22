import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { resolve } from 'path'

const dbFile = resolve('data/database.sqlite')

const init = async () => {
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database
  })

  // Users tábla
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL
    );
  `)

  // Posts tábla
  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      authorId INTEGER NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (authorId) REFERENCES users(id)
    );
  `)

  // Demo adatok (3 user + 2-2 blog)
  await db.run(`INSERT INTO users (name, age) VALUES ('Anna', 30), ('Béla', 40), ('Csilla', 25);`)
  await db.run(`INSERT INTO posts (title, authorId, category, content, createdAt, updatedAt)
    VALUES 
    ('Első poszt Annától', 1, 'Hírek', 'Anna bejegyzése 1', datetime('now'), datetime('now')),
    ('Második poszt Annától', 1, 'Hírek', 'Anna bejegyzése 2', datetime('now'), datetime('now')),
    ('Első poszt Bélától', 2, 'Tech', 'Béla bejegyzése 1', datetime('now'), datetime('now')),
    ('Második poszt Bélától', 2, 'Tech', 'Béla bejegyzése 2', datetime('now'), datetime('now')),
    ('Első poszt Csillától', 3, 'Kultúra', 'Csilla bejegyzése 1', datetime('now'), datetime('now')),
    ('Második poszt Csillától', 3, 'Kultúra', 'Csilla bejegyzése 2', datetime('now'), datetime('now'));
  `)

  console.log('Adatbázis sikeresen létrehozva és feltöltve.')
}

init()
