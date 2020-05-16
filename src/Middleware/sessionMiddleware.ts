import session from "express-session";

export const sessionMiddleWare = session({
  secret: "thisIsTheBiggestSecret",
  cookie: { secure: false },
  resave: false,
  saveUninitialized: false,
});
