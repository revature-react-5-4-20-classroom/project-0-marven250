import express, { Request, Response, Router, NextFunction } from "express";
import { User } from "../Models/User";
export const userRouter: Router = express.Router();
import { authMiddleware } from "../Middleware/authMiddleware";
import { getAllUsers } from "../Database/user-data-access";

userRouter.use("/", authMiddleware);

userRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session
      ? console.log(req.session.user)
      : console.log("There's no session");
    // get all users, using async/await
    const users: User[] = await getAllUsers();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

userRouter.get("/:id", (req: Request, res: Response) => {
  //Allowed Roles finance-manager or if the id provided matches the id of the current user
  // Response: [   User ]
});

userRouter.patch("/", (req: Request, res: Response) => {
  //Allowed Roles admin
  // The userId must be present as well as all fields to update, any field left undefined will not be updated.
  // Request: User
  // Response: User
});
