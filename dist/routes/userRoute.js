"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usercontroller_1 = require("../controllers/usercontroller");
const authmiddleware_1 = require("../middleware/authmiddleware");
const userRouter = (0, express_1.Router)();
userRouter.get("/public/:identifier", usercontroller_1.getPublicProfile);
userRouter.get("/username/:username", usercontroller_1.getUserByUsernameController);
userRouter.get("/email/:email", usercontroller_1.findUserByEmailController);
userRouter.use(authmiddleware_1.authMiddleware);
userRouter.get("/profile", usercontroller_1.getProfile);
userRouter.put("/profile", usercontroller_1.updateProfile);
userRouter.post("/profile/picture", usercontroller_1.updateProfilePictureController);
userRouter.get("/:userId", usercontroller_1.getUserByIdController);
userRouter.delete("/account", usercontroller_1.deleteAccount);
userRouter.get("/search", usercontroller_1.searchUsersController);
// Admin routes - uncomment when admin middleware is implemented
// Admin routes - uncomment when admin middleware is implemented
// userRouter.use(adminMiddleware);
// userRouter.get("/admin/all", getAllUsersController);
exports.default = userRouter;
//# sourceMappingURL=userRoute.js.map