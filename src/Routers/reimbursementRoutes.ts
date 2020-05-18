import express, { Request, Response, Router, NextFunction } from "express";
import { Reimbursement } from "../Models/Reimbursement";
export const reimbursementRouter: Router = express.Router();
import {
  postReimbursement,
  patchReimbursement,
} from "../Database/user-data-access";

reimbursementRouter.get("/status/:statusId", (req: Request, res: Response) => {
  // Allowed Roles finance-manager
  // Response: [ Reimbursement ]
});

reimbursementRouter.get(
  "/author/userId/:userId",
  (req: Request, res: Response) => {
    //Allowed Roles finance-manager or if ther userId is the user making the request.
    // Response: [ Reimbursement ]
  }
);

reimbursementRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      id,
      amount,
      dateSubmitted,
      dateResolved,
      description,
      resolver,
      status,
      type,
    } = req.body;
    const author = req.session && req.session.user.id;

    try {
      // if (req.session && req.session.user) {
      const postedReimbursement = await postReimbursement(
        id,
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type
      );
      res.status(201).json(postedReimbursement);
      // }else
    } catch (e) {
      next(e);
    }
  }
);

reimbursementRouter.patch(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    //Allowed Roles finance-manager
    //The reimbursementId must be presen as well as all fields to update, any field left undefined will not be updated. This can be used to approve and deny.
    // Request: Reimbursement
    // Response: Reimbursement
    console.log(req.body, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    const { id, date, status } = req.body;

    if (req.session && req.session.user.role === "finance-manager") {
      if (id == false) res.send("you need id to patch user");
      try {
        const patchedReimbursement = await patchReimbursement(id, date, status);
        res.status(200).json(patchedReimbursement);
      } catch (e) {
        next(e);
      }
    } else {
      res.status(400).send("Only finance-manager user has such privileges");
    }
  }
);
