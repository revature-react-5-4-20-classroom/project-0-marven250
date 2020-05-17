import express, { Request, Response, Router, NextFunction } from "express";
import { User } from "../Models/User";
export const userRouter: Router = express.Router();
import { userAuthMiddleware } from "../Middleware/authMiddleware";
import { getAllUsers, getUserById } from "../Database/user-data-access";

userRouter.use("/", userAuthMiddleware);

userRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user.role === "finance-manager") {
    try {
      const users: User[] = await getAllUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  } else {
    res.status(400).send("Access denied");
  }
});

userRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (
        (req.session && req.session.user.id === id) ||
        (req.session && req.session.user.role === "finance-manager")
      ) {
        const singleUser: User[] = await getUserById(id);
        console.log(id, singleUser[0].id);
        res.json(singleUser);
      } else {
        res.status(400).send("You don't have access to his user");
      }
    } catch (e) {
      next(e);
    }
  }
);

userRouter.patch("/", (req: Request, res: Response) => {
  //Allowed Roles admin
  // The userId must be present as well as all fields to update, any field left undefined will not be updated.
  // Request: User
  // Response: User
});
