import { Router } from "express";
import {
  register,
  login,
  resetUserPassword,
  logout,
  logoutAll,
  getProfile,
  verifyToken,
} from "../controllers/authcontroller";
import { authMiddleware } from "../middleware/authmiddleware";

const authRouter = Router();


authRouter.post("/register", register);
authRouter.post("/login", login);


authRouter.use(authMiddleware); 

authRouter.get("/profile", getProfile);
authRouter.get("/verify-token", verifyToken);
authRouter.post("/logout", logout);
authRouter.post("/logout-all", logoutAll);


authRouter.post("/reset-password/:userId", resetUserPassword);

export default authRouter;
