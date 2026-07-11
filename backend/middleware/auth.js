import jwt from 'jsonwebtoken';

// Runs before any protected route. Reads the JWT from the
// "Authorization: Bearer <token>" header and attaches the user's id
// to req.userId, so every route below knows whose data to touch.
export const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};
