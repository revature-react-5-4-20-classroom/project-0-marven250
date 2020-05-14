import express, { Request, Response, Router } from "express";
export const reimbursementRouter: Router = express.Router();

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

reimbursementRouter.post("/", (req: Request, res: Response) => {
  // The reimbursementId should be 0
  // Request: Reimbursement
  // Response: Reimbursement
  // Status Code 201 CREATED
});

reimbursementRouter.patch("/", (req: Request, res: Response) => {
  //Allowed Roles finance-manager
  //The reimbursementId must be presen as well as all fields to update, any field left undefined will not be updated. This can be used to approve and deny.
  // Request: Reimbursement
  // Response: Reimbursement
});
