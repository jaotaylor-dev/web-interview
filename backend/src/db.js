import Database from 'better-sqlite3'
import { randomUUID } from 'crypto'

const db = new Database('todos.sqlite')

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS todo_lists (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS todo_items (
    id TEXT PRIMARY KEY,
    list_id TEXT NOT NULL REFERENCES todo_lists(id) ON DELETE CASCADE,
    text TEXT NOT NULL DEFAULT '',
    completed INTEGER NOT NULL DEFAULT 0,
    due_date TEXT,
    position INTEGER NOT NULL
  );
`)

const isEmpty = db.prepare('SELECT COUNT(*) as count FROM todo_lists').get().count === 0
if (isEmpty) {
  const insertList = db.prepare('INSERT INTO todo_lists (id, title) VALUES (?, ?)')
  const insertItem = db.prepare(
    'INSERT INTO todo_items (id, list_id, text, position) VALUES (?, ?, ?, ?)',
  )

  db.transaction(() => {
    insertList.run('0000000001', 'First List')
    insertItem.run(randomUUID(), '0000000001', 'First todo of first list!', 0)

    insertList.run('0000000002', 'Second List')
    insertItem.run(randomUUID(), '0000000002', 'First todo of second list!', 0)
  })()
}

const selectAllLists = db.prepare('SELECT id, title FROM todo_lists')
const selectAllItems = db.prepare(
  'SELECT list_id, text, completed, due_date FROM todo_items ORDER BY position',
)
const selectListById = db.prepare('SELECT id FROM todo_lists WHERE id = ?')
const deleteItemsByListId = db.prepare('DELETE FROM todo_items WHERE list_id = ?')
const insertItem = db.prepare(
  'INSERT INTO todo_items (id, list_id, text, completed, due_date, position) VALUES (?, ?, ?, ?, ?, ?)',
)

export function getAllLists() {
  const lists = selectAllLists.all()
  const items = selectAllItems.all()

  const result = {}
  for (const list of lists) {
    result[list.id] = { id: list.id, title: list.title, todos: [] }
  }
  for (const item of items) {
    if (result[item.list_id]) {
      result[item.list_id].todos.push({
        text: item.text,
        completed: Boolean(item.completed),
        dueDate: item.due_date,
      })
    }
  }
  return result
}

export const updateListTodos = db.transaction((listId, todos) => {
  const list = selectListById.get(listId)
  if (!list) return null

  deleteItemsByListId.run(listId)
  todos.forEach((todo, index) => {
    insertItem.run(
      randomUUID(),
      listId,
      todo.text || '',
      todo.completed ? 1 : 0,
      todo.dueDate || null,
      index,
    )
  })

  return { id: listId, todos }
})
