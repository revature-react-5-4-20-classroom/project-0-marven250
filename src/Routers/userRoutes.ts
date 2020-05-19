import express, { Request, Response, Router, NextFunction } from "express";
import { User } from "../Models/User";
export const userRouter: Router = express.Router();
import { userAuthMiddleware } from "../Middleware/authMiddleware";
import {
  getAllUsers,
  getUserById,
  patchUser,
} from "../Database/user-data-access";

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
    res.status(401).json({
      message: "The incoming token has expired",
    });
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

        res.json(singleUser);
      } else {
        res.status(401).json({
          message: "The incoming token has expired",
        });
      }
    } catch (e) {
      next(e);
    }
  }
);

userRouter.patch(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    const {
      id,
      username,
      firstname,
      lastname,
      password,
      email,
      role,
    } = req.body;

    if (req.session && req.session.user.role === "admin") {
      if (id == false) res.send("you need to provide id to patch user");

      try {
        const patchedUser = await patchUser(
          id,
          username,
          firstname,
          lastname,
          password,
          email,
          role
        );
        res.status(200).json(patchedUser);
      } catch (e) {
        next(e);
      }
    } else {
      res.status(401).json({
        message: "The incoming token has expired",
      });
    }
  }
);
