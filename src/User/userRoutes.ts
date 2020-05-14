import express, { Request, Response, Router } from "express";
export const userRouter: Router = express.Router();

userRouter.get("/", (req: Request, res: Response) => {
  //Allowed Roles finance-manager
  // Response: [ Users ]
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
