import { WebComponent, on } from "/vendor/bean/base.js";
import state from "/static/js/state.js";
import { TodosClient } from "/static/js/services/todos.js";
import { UPDATE_TODO, DELETE_TODO, CREATE_TODO } from "./consts.js";
import "./adder.js";
import "./item.js";

const todosClient = new TodosClient();

await todosClient.getTodos();

export default (class TodosSection extends WebComponent {
  static tagName = "todos-section";
  static html = `
    <style>
        todos-adder {
            display: block;
            margin-bottom: 15px;
        }
        div {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }
    </style>
    <todos-adder></todos-adder>
    <div role="list">
    </div>
  `;

  static handles = {
    items: (dom) => dom.querySelector("div"),
    adder: (dom) => dom.querySelector("todos-adder"),
  };

  [on(CREATE_TODO)](event) {
    const todo = event.detail;
    todosClient.addTodo(todo);
  }

  [on(UPDATE_TODO)](event) {
    const todo = event.detail;
    todosClient.updateTodo(todo);
  }

  [on(DELETE_TODO)](event) {
    const { detail: todo } = event;
    todosClient.deleteTodo(todo);
  }

  createTodoElement(todo) {
    const todoItem = document.createElement("todo-item");
    todoItem.todo = todo;
    return todoItem;
  }

  syncChanges(todos) {
    this.items.replaceChildren(
      ...todos.map((todo) => this.createTodoElement(todo)).reverse()
    );
  }

  async forkStateUpdates() {
    for await (let { todos } of state.untilCancelled({
      signal: this.connectionSignal,
    })) {
      console.log('message');
      this.syncChanges(todos);
    }
  }

  onBeforeMount() {
    this.forkStateUpdates();
  }
}.setup());
