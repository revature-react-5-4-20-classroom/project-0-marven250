import express from "express";
import { Request, Response, Application } from "express";
import bodyParser from "body-parser";
const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("yoooooooo");
});

app.post("/login", (req: Request, res) => {
  //    request {
  //   username: string,
  //   password: string
  // }
  // response  User
  // err Status Code: 400 BAD REQUEST
  // {
  //   message: "Invalid Credentials"
  // }
});

app.get("/users", (req: Request, res: Response) => {
  //Allowed Roles finance-manager
  // Response: [ Users ]
});

app.get("/users/:id", (req: Request, res: Response) => {
  //Allowed Roles finance-manager or if the id provided matches the id of the current user
  // Response: [   User ]
});

app.patch("/users", (req: Request, res: Response) => {
  //Allowed Roles admin
  // The userId must be present as well as all fields to update, any field left undefined will not be updated.
  // Request: User
  // Response: User
});

app.get("/reimbursements/status/:statusId", (req: Request, res: Response) => {
  // Allowed Roles finance-manager
  // Response: [ Reimbursement ]
});

app.get(
  "/reimbursements/author/userId/:userId",
  (req: Request, res: Response) => {
    //Allowed Roles finance-manager or if ther userId is the user making the request.
    // Response: [ Reimbursement ]
  }
);

app.post("/reimbursements", (req: Request, res: Response) => {
  // The reimbursementId should be 0
  // Request: Reimbursement
  // Response: Reimbursement
  // Status Code 201 CREATED
});

app.patch("/reimbursements", (req: Request, res: Response) => {
  //Allowed Roles finance-manager
  //The reimbursementId must be presen as well as all fields to update, any field left undefined will not be updated. This can be used to approve and deny.
  // Request: Reimbursement
  // Response: Reimbursement
});

app.listen(PORT, () => {
  console.log(`Our server is listening on port ${PORT}`);
});
