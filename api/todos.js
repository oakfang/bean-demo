import { createAudience } from "../wire.js";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  select,
  dbStateManager,
} from "../db.js";
import { TodosClient } from "../public/static/js/services/todos.js";

const todosClient = new TodosClient(({ method, url, body }) => {
  switch (method) {
    case "GET": {
      const { todos } = select();
      return todos;
    }
  }
});
todosClient.state = dbStateManager;

export const prefix = "/todos";

export async function controller(fastify) {
  const { publish } = createAudience(fastify);

  fastify.get("/", async () => {
    return todosClient.getTodos();
  });

  fastify.post("/", async (request, reply) => {
    const todo = await addTodo(request.body);
    publish(request, "add", todo);
    reply.status(201).send(todo);
  });

  fastify.put("/:id", async (request, reply) => {
    const todo = await updateTodo(request.params.id, request.body);
    reply.send(todo);
    publish(request, "update", todo);
  });

  fastify.delete("/:id", async (request, reply) => {
    await deleteTodo(request.params.id);
    reply.send(null);
    publish(request, "delete", request.params.id);
  });
}
