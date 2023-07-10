import { FastifyInstance } from "fastify";
import { createProductHandler, getProductHandler } from "./product.controller";

const productRoutes = async (server: FastifyInstance) => {
  const { prefix } = server;
  server.zod.post(`${prefix}/`, {
    operationId: "createProduct",
    body: "createProductBodySchema",
    response: {
      201:{
        description: "登録完了",
        key: "productResponseSchema",
      }
    },
    tags: ["Product"],
  }, createProductHandler);

  server.zod.get(`${prefix}/:id`, {
    operationId: "getProduct",
    params: "getProductParamsSchema",
    querystring: "getProductQuerySchema",
    response: {
      200: {
        key: "productResponseSchema",
        description: "取得成功",
      },
    },
    tags: ["Product"],
  }, getProductHandler);
};

export default productRoutes;
