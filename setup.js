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
  await db.run(`INSERT INTO users (name, age) VALUES ('1 - Csíkos Marcell', 18), ('2 - Czesznak Attila', 18), ('3 - Böbe néni', 62);`)
  await db.run(`INSERT INTO posts (title, authorId, category, content, createdAt, updatedAt)
  VALUES 
  ('SQLite3', 1, 'Hírek', 'A egy , és SQLite3 adatbázis-kezelő Node.js-hez. Ez a csomag kifejezetten és lett optimalizálva, és gyakran ajánlott olyan esetekben, amikor nincs szükség aszinkron adatbázis-kezelésre.', datetime('now'), datetime('now')),
  ('Tábla létrehozása', 1, 'Programozás', 'db.prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)").run();', datetime('now'), datetime('now')),
  ('Körözés indult Csíkos Marcell ellen!', 2, 'Bűnügy', 'Marcell blogja illegális információkat tartalmazott ezért körözik.', datetime('now'), datetime('now')),
  ('Elfogták a bűnözőt!', 2, 'Bűnügy', 'Sikeresen letartóztatták Csíkos Marcellt és a posztjait vagy módosították vagy törölték.', datetime('now'), datetime('now')),
  ('Elszomorító...', 3, 'Társadalom', 'Az elmúlt időben történt egy letartóztatás, ti mit szóltok hozzá? Szerintem igazságtalanság!!!', datetime('now'), datetime('now')),
  ('Új hús a láthatáron?', 3, 'Politika', 'Majka is indul a 2026-os választáson és már most népszerűbb mint drága vezérünk.', datetime('now'), datetime('now'));
`)


  console.log('Adatbázis sikeresen létrehozva és feltöltve.')
}

init()
