import fastify from "fastify";
import fs from "fs";
import { register } from "fastify-zod";
import { productModels, productSchemas } from "./modules/product/product.schema";
import productRoutes from "./modules/product/product.route";
import type { FastifyZod } from "fastify-zod";

declare module "fastify" {
  interface FastifyInstance {
    readonly zod: FastifyZod<typeof productModels>;
  }
}

const server = fastify({
  logger: true,
  // The example attribute for OpenAPI is disturbed by Ajv validation,
  // so it should be log output only.
  ajv: {
    customOptions: {
      strict: "log",
      keywords: ["example"],
    },
  },
});

const main = async () => {
  await register(server, {
    jsonSchemas: productSchemas,
    swaggerOptions: {
      openapi: {
        info: {
          title: "Sample API using Fastify and Zod.",
          description:
            "ZodのバリデーションスキーマからリッチなOpenAPI仕様を出力するサンプル",
          version: "1.0.0",
        },
      },
    },
    swaggerUiOptions: {
      routePrefix: "/docs",
      staticCSP: true,
    },
  });

  server.register(productRoutes, { prefix: "/products" });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server listining on port 3000");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  const responseYaml = await server.inject("/docs/yaml");
  fs.writeFileSync("docs/openapi.yaml", responseYaml.payload);
};

main();
