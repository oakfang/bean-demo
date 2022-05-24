import path from "path";
import * as url from "url";
import createServer from "fastify";
import fastifyStaticPlugin from "@fastify/static";
import fastifyWebsocketPlugin from "@fastify/websocket";
import { controller, prefix } from "./api/index.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const fastify = createServer({ logger: true });
fastify.register(fastifyStaticPlugin, {
  root: path.resolve(__dirname, "..", "client"),
  wildcard: false,
});
fastify.register(fastifyWebsocketPlugin);

fastify.register(controller, { prefix });

fastify.get("*", (_, reply) => reply.sendFile("index.html"));

export default fastify;
