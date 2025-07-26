"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authcontroller_1 = require("../controllers/authcontroller");
const authmiddleware_1 = require("../middleware/authmiddleware");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", authcontroller_1.register);
authRouter.post("/login", authcontroller_1.login);
authRouter.use(authmiddleware_1.authMiddleware);
authRouter.get("/profile", authcontroller_1.getProfile);
authRouter.get("/verify-token", authcontroller_1.verifyToken);
authRouter.post("/logout", authcontroller_1.logout);
authRouter.post("/logout-all", authcontroller_1.logoutAll);
authRouter.post("/reset-password/:userId", authcontroller_1.resetUserPassword);
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map