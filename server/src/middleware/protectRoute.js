import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
