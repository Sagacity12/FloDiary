import http from "http";
import { Request, Response } from "express";
import { createExpressApp } from "./servers/createExpressApp";
import { logger } from "./logger/logger";
import { connectDB } from "./servers/mongodb/mongodb";
import client from "./servers/mongodb/redisConnectDB";
import applyRouters from "./routes/routes";
import errorHandler from "./middleware/error-handle";


const PORT = process.env.PORT || 3000;

/**
 * create he http server here and start the server
 */
export const startServer = async () => {
  await connectDB(String(process.env.MONGO_URL));
  //logger.info("MongoDB connected successfully");

  await client.connect();
  logger.info("Redis connected successfully");

  const app = await createExpressApp();

  app.get("/", (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Welcome to FLoDiary API",
      version: "1.0.0",
      endpoints: {
        api: "/api/v1",
        auth: "/api/v1/auth",
        user: "/api/v1/user",
      },
      server: {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
      },
    });
  });

  await applyRouters(app);

  app.use(errorHandler);

  //app.all("*", (_req, _, next) => {
  //  next(createError(404, "Not Found"));
  //});

  const server = http.createServer(app);
  
  server.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });
};

export default startServer;
