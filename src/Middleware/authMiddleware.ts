import express, { Request, Response, NextFunction } from "express";
import session from "express-session";

export function authRoleFactory(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.user) {
      res.status(401).send("Please login");
    } else {
      let allowed = false;
      for (let role of roles) {
        if (req.session.user.role === role) {
          allowed = true;
        }
      }
      if (allowed) {
        next();
      } else {
        res
          .status(403)
          .send(`Not authorized with role: ${req.session.user.role}`);
      }
    }
  };
}

// Our factory can produce our admin role middleware.

// let GET requests in from anyone, let POST/other requests in if the user is logged in
export const authReadOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "GET") {
    next();
  } else if (!req.session || !req.session.user) {
    res.status(401).send(`Cannot ${req.method} unless you first login`);
  } else {
    next();
  }
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "GET") {
    console.log(req.query);
    next();
  } else if (!req.session || !req.session.user) {
    res.status(401).send(`Cannot ${req.method} unless you first login`);
  } else {
    next();
  }
};
