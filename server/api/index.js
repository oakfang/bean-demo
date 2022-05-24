const services = await Promise.all(
  ["todos"].map((name) => import(`./${name}.js`))
);

export const prefix = "/api";

export async function controller(fastify) {
  services.forEach(({ controller, prefix }) => {
    fastify.register(controller, { prefix });
  });
}
