import { v4 as uuid } from "uuid";

export function createAudience(fastify) {
  const audience = new Set();
  const audienceById = {};
  fastify.get("/wire", { websocket: true }, (connection) => {
    const audienceId = uuid();
    audience.add(connection);
    audienceById[audienceId] = connection;
    connection.socket.send(JSON.stringify({ type: "audience", audienceId }));
    connection.socket.on("close", () => {
      audience.delete(connection);
      delete audienceById[audienceId];
    });
  });

  return {
    publish(request, type, data) {
      audience.forEach((connection) => {
        if (audienceById[request.headers["x-audience-id"]] === connection) {
          return;
        }
        try {
          connection.socket.send(JSON.stringify({ type, data }));
        } catch {}
      });
    },
  };
}
