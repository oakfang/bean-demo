import { v4 as uuid } from "uuid";
import { select, dbStateManager } from "../db.js";
import { createAudience } from "../com/wire.js";
import { TodosClient } from "../../client/static/js/services/todos.js";

const todosClient = new TodosClient(({ method, body }) => {
  switch (method) {
    case "GET": {
      const { todos } = select();
      return todos;
    }
    case "POST": {
      const todo = { ...body, id: uuid() };
      return todo;
    }
    case "PUT": {
      return body;
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
    const todo = await todosClient.addTodo(request.body);
    publish(request, "add", todo);
    reply.status(201).send(todo);
  });

  fastify.put("/:id", async (request, reply) => {
    const todo = await todosClient.updateTodo(request.body);
    reply.send(todo);
    publish(request, "update", todo);
  });

  fastify.delete("/:id", async (request, reply) => {
    await todosClient.deleteTodo(request.params.id);
    reply.send(null);
    publish(request, "delete", request.params.id);
  });
}
