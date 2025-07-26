import { Router } from "express";
import {
  getUserByIdController,
  getUserByUsernameController,
  getProfile,
  updateProfile,
  updateProfilePictureController,
  findUserByEmailController,
  getPublicProfile,
  deleteAccount,
  getAllUsersController,
  searchUsersController,
} from "../controllers/usercontroller";
import { authMiddleware } from "../middleware/authmiddleware";

const userRouter = Router();


userRouter.get("/public/:identifier", getPublicProfile);
userRouter.get("/username/:username", getUserByUsernameController);
userRouter.get("/email/:email", findUserByEmailController);


userRouter.use(authMiddleware);


userRouter.get("/profile", getProfile);
userRouter.put("/profile", updateProfile);
userRouter.post("/profile/picture", updateProfilePictureController);
userRouter.get("/:userId", getUserByIdController);


userRouter.delete("/account", deleteAccount);


userRouter.get("/search", searchUsersController);

// Admin routes - uncomment when admin middleware is implemented
// Admin routes - uncomment when admin middleware is implemented
// userRouter.use(adminMiddleware);
// userRouter.get("/admin/all", getAllUsersController);

export default userRouter;
