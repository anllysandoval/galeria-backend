export const isAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: ['Acceso denegado: se requiere rol admin'] });
  }
  next();
};
