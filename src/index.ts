import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import { userRouter } from "./User/userRoutes";
import { reimbursementRouter } from "./Reimbursement/reimbursementRoutes";
const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/users", userRouter);
app.use("/reimbursements", reimbursementRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("yoooooooo");
});

app.post("/login", (req: Request, res: Response) => {
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

app.listen(PORT, () => {
  console.log(`Our server is listening on port ${PORT}`);
});
