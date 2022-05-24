import path from "path";
import * as url from "url";
import createServer from "fastify";
import fastifyStaticPlugin from "@fastify/static";
import fastifyWebsocketPlugin from "@fastify/websocket";
import { controller, prefix } from "./api/index.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const fastify = createServer({ logger: true });
fastify.register(fastifyStaticPlugin, {
  root: path.join(__dirname, "public"),
  wildcard: false,
});
fastify.register(fastifyWebsocketPlugin);

fastify.register(controller, { prefix });

fastify.get("*", (_, reply) => reply.sendFile("index.html"));

// Run the server!
const start = async () => {
  try {
    await fastify.listen(4000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
