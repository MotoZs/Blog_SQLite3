import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { resolve } from 'path'

const dbPromise = open({
  filename: resolve('data/database.sqlite'),
  driver: sqlite3.Database
})

// USERS
export async function getUsers() {
  const db = await dbPromise
  return await db.all('SELECT * FROM users')
}

export async function getUser(id) {
  const db = await dbPromise
  return await db.get('SELECT * FROM users WHERE id = ?', id)
}

export async function savedUser(name, age) {
  const db = await dbPromise
  return await db.run('INSERT INTO users (name, age) VALUES (?, ?)', name, age)
}

export async function updatedUser(id, name, age) {
  const db = await dbPromise
  return await db.run('UPDATE users SET name = ?, age = ? WHERE id = ?', name, age, id)
}

export async function deleteUser(id) {
  const db = await dbPromise
  return await db.run('DELETE FROM users WHERE id = ?', id)
}

// POSTS
export async function getPosts() {
  const db = await dbPromise
  return await db.all(`
    SELECT posts.*, users.name as authorName 
    FROM posts 
    JOIN users ON posts.authorId = users.id
  `)
}

export async function getPost(id) {
  const db = await dbPromise
  return await db.get(`
    SELECT posts.*, users.name as authorName 
    FROM posts 
    JOIN users ON posts.authorId = users.id
    WHERE posts.id = ?
  `, id)
}

export async function savePost({ title, authorId, category, content }) {
  const db = await dbPromise
  const now = new Date().toISOString()
  return await db.run(`
    INSERT INTO posts (title, authorId, category, content, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)`, title, authorId, category, content, now, now)
}

export async function updatePost(id, { title, category, content }) {
  const db = await dbPromise
  const now = new Date().toISOString()
  return await db.run(`
    UPDATE posts SET title = ?, category = ?, content = ?, updatedAt = ?
    WHERE id = ?`, title, category, content, now, id)
}

export async function deletePost(id) {
  const db = await dbPromise
  return await db.run('DELETE FROM posts WHERE id = ?', id)
}
