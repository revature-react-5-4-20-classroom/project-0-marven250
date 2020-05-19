require("dotenv").config();
import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import { userRouter } from "./Routers/userRoutes";
import { reimbursementRouter } from "./Routers/reimbursementRoutes";
import { findUserByUsernamePassword } from "./Database/user-data-access";
import { sessionMiddleware } from "./Middleware/sessionMiddleware";
const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(sessionMiddleware);
app.use("/users", userRouter);
app.use("/reimbursements", reimbursementRouter);

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .send("Please include username and password fields for login");
  } else {
    try {
      const user = await findUserByUsernamePassword(username, password);
      if (req.session) {
        req.session.user = user;
      }
      //send the user back, as a favor to our future selves
      res.json(user);
    } catch (e) {
      console.log(e.message);
      res.status(400).json({
        message: "Invalid Credentials",
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Our server is listening on port ${PORT}`);
});
