import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
import User from '../models/user.models.js';
import Role from '../models/roles.models.js';
import jwt from 'jsonwebtoken';

dotenv.config();

// Middleware de Auth0: valida el JWT emitido por Auth0
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',

  onError: (err) => {
    console.log("JWT ERROR:", err);
  }
});

// Middleware: extrae el auth0Id del token y lo adjunta al request
export const jwtParse = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: ['No autorizado'] });
  }

  const token = authorization.split(' ')[1];
  try {
    const decoded = jwt.decode(token);
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(401).json({ message: ['Usuario no encontrado'] });

    const role = await Role.findById(user.role);

    req.auth0Id = auth0Id;
    req.userId = user._id.toString();
    req.isAdmin = role ? role.role === process.env.SETUP_ROLE_ADMIN : false;
    req.roleId = user.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: ['Token inválido'] });
  }
};
