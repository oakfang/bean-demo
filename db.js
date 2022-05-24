import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

// If file.json doesn't exist, db.data will be null
// Set default data
db.data ||= { todos: [] };

export function select() {
  return db.data;
}

export async function commit() {
  await db.write();
}

export async function rollback() {
  await db.read();
}

export const dbStateManager = {
  async update(updater) {
    await updater(select);
    await commit();
  },
  async tx(updater, effect) {
    try {
      await this.update(updater);
      await effect();
      await commit();
    } catch {
      await rollback();
    }
  },
};

export const getTodos = async () => {
  return db.data.todos;
};

export const addTodo = async (todo) => {
  todo.id = uuid();
  db.data.todos.push(todo);
  await db.write();
  return todo;
};

export const updateTodo = async (todoId, todo) => {
  const idx = db.data.todos.findIndex(({ id }) => todoId === id);
  if (idx > -1) {
    db.data.todos[idx] = todo;
  }
  await db.write();
  return todo;
};

export const deleteTodo = async (todoId) => {
  const idx = db.data.todos.findIndex(({ id }) => todoId === id);
  if (idx > -1) {
    db.data.todos.splice(idx, 1);
  }
  await db.write();
};
