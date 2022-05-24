import stateManager from "../state.js";
import { ApiClient } from "../api.js";

export class TodosClient extends ApiClient {
  static baseUrl = "/api/todos";
  static wire = true;
  state = stateManager;

  #setTodos(todos) {
    this.state.update((current) => {
      current.todos = todos;
    });
  }

  async getTodos() {
    const todos = await this.get("/");
    if (this.isRemote) {
      this.#setTodos(todos);
    }
    return todos;
  }

  handleMessage(message) {
    switch (message.type) {
      case "add": {
        const todo = message.data;
        return this.state.update((current) => {
          current.todos.push(todo);
        });
      }
      case "update": {
        const todo = message.data;
        return this.state.update((current) => {
          const idx = current.todos.findIndex(({ id }) => todo.id === id);
          if (idx > -1) {
            current.todos[idx] = todo;
          }
        });
      }
      case "delete": {
        const todoId = message.data;
        this.state.update((current) => {
          const idx = current.todos.findIndex(({ id }) => todoId === id);
          if (idx > -1) {
            current.todos.splice(idx, 1);
          }
        });
      }
    }
  }

  async addTodo(todo) {
    this.state.tx(
      (current) => {
        current.todos.push(todo);
      },
      async () => {
        const created = await this.post("/", todo);
        this.state.update((current) => {
          const t = current.todos.find((t) => t === todo);
          Object.assign(t, created);
        });
      }
    );
  }

  async updateTodo(todo) {
    this.state.tx(
      (current) => {
        const idx = current.todos.findIndex(({ id }) => todo.id === id);
        if (idx > -1) {
          current.todos[idx] = todo;
        }
      },
      () => this.put(`/${todo.id}`, todo)
    );
  }

  async deleteTodo(todo) {
    this.state.tx(
      (current) => {
        const idx = current.todos.findIndex(({ id }) => todo.id === id);
        if (idx > -1) {
          current.todos.splice(idx, 1);
        }
      },
      () => this.delete(`/${todo.id}`)
    );
  }
}
