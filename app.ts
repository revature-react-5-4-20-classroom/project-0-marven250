import express from "express";
import { Request, Response, NextFunction } from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("yoooooooo");
});

app.listen(PORT, () => {
  console.log(`Our server is listening on port ${PORT}`);
});
