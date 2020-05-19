import express, { Request, Response, Router, NextFunction } from "express";
import { Reimbursement } from "../Models/Reimbursement";
import moment from "moment";

export const reimbursementRouter: Router = express.Router();
import {
  postReimbursement,
  patchReimbursement,
  getReimbursementByStatus,
} from "../Database/user-data-access";

reimbursementRouter.get(
  "/status/:statusId",
  async (req: Request, res: Response, next: NextFunction) => {
    //Allowed Roles finance-manager or if ther userId is the user making the request.
    // Response: [ Reimbursement ]
    console.log("we've hit our endpoint");
    try {
      const id = Number(req.params.id);
      if (req.session && req.session.user) {
        if (
          (req.session && req.session.user.id === id) ||
          (req.session && req.session.user.role === "finance-manager")
        ) {
          const singleReimbursement: Reimbursement[] = await getReimbursementByStatus(
            id
          );

          res.json(singleReimbursement);
        } else {
          res.status(400).send("You don't have access to his user");
        }
      } else {
        res.status(400).json({
          message: "The incoming token has expired",
        });
      }
    } catch (e) {
      next(e);
    }
  }
);

reimbursementRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.user) {
      const { id, amount, description, type } = req.body;
      const dateSubmitted = moment().format("MMMM Do YYYY, h:mm:ss a");
      const author = req.session && req.session.user.username;
      const dateResolved = "";
      const resolver = "finance-manager";
      const status = 1;

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
    } else {
      res.status(400).json({
        message: "The incoming token has expired",
      });
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
    //console.log(req.body, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    let { id, status } = req.body;
    const date = moment().format("MMMM Do YYYY, h:mm:ss a");
    //console.log(date);
    if (status !== 2 && status !== 3) status = 1;

    if (req.session && req.session.user) {
      if (req.session && req.session.user.role === "finance-manager") {
        if (id == false) res.send("you need id to patch user");
        try {
          const patchedReimbursement = await patchReimbursement(
            id,
            date,
            status
          );
          res.status(200).json(patchedReimbursement);
        } catch (e) {
          next(e);
        }
      } else {
        res.status(400).send("Only finance-manager user has such privileges");
      }
    } else {
      res.status(400).json({
        message: "The incoming token has expired",
      });
    }
  }
);
