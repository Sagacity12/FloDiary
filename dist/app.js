"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const http_1 = __importDefault(require("http"));
const createExpressApp_1 = require("./servers/createExpressApp");
const logger_1 = require("./logger/logger");
const mongodb_1 = require("./servers/mongodb/mongodb");
const redisConnectDB_1 = __importDefault(require("./servers/mongodb/redisConnectDB"));
const routes_1 = __importDefault(require("./routes/routes"));
const error_handle_1 = __importDefault(require("./middleware/error-handle"));
const PORT = process.env.PORT || 3000;
/**
 * create he http server here and start the server
 */
const startServer = async () => {
    await (0, mongodb_1.connectDB)(String(process.env.MONGO_URL));
    //logger.info("MongoDB connected successfully");
    await redisConnectDB_1.default.connect();
    logger_1.logger.info("Redis connected successfully");
    const app = await (0, createExpressApp_1.createExpressApp)();
    app.get("/", (req, res) => {
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
    await (0, routes_1.default)(app);
    app.use(error_handle_1.default);
    //app.all("*", (_req, _, next) => {
    //  next(createError(404, "Not Found"));
    //});
    const server = http_1.default.createServer(app);
    server.listen(PORT, () => {
        logger_1.logger.info(`Server started on port ${PORT}`);
    });
};
exports.startServer = startServer;
exports.default = exports.startServer;
//# sourceMappingURL=app.js.map