"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoute_1 = __importDefault(require("./userRoute"));
const authmiddleware_1 = require("../middleware/authmiddleware");
const baseUrl = "/api/v1/";
const routes = [
    { path: `${baseUrl}auth`, router: authRoutes_1.default, userToken: false },
    { path: `${baseUrl}user`, router: userRoute_1.default, userToken: true },
];
const applyRouters = async (app) => {
    routes.map((route) => {
        if (route.userToken) {
            app.use(route.path, authmiddleware_1.authMiddleware, route.router);
        }
        else {
            app.use(route.path, route.router);
        }
    });
};
exports.default = applyRouters;
//# sourceMappingURL=routes.js.map