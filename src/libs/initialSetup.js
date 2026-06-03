import Role from '../models/roles.models.js';
import User from '../models/user.models.js';
import dotenv from 'dotenv';
import { connectDB } from '../db.js';

export const initializeSetup = async () => {
  try {
    dotenv.config();
    connectDB();

    const roleAdmin = process.env.SETUP_ROLE_ADMIN;
    const roleUser = process.env.SETUP_ROLE_USER;

    // Crear roles si no existen
    const countRoles = await Role.estimatedDocumentCount();
    if (countRoles === 0) {
      console.log('Creando roles de usuarios');
      await Promise.all([
        new Role({ role: roleUser }).save(),
        new Role({ role: roleAdmin }).save(),
      ]);
    }

    // Crear usuario admin si no existe
    const setupAdminAuth0Id = process.env.SETUP_ADMIN_AUTH0ID;
    const setupEmail = process.env.SETUP_ADMIN_EMAIL;

    const userAdmin = await User.findOne({ auth0Id: setupAdminAuth0Id });
    if (userAdmin == null) {
      console.log('Creando nuevo admin');
      const roleAdminDB = await Role.findOne({ role: roleAdmin });
      const newUserAdmin = new User({
        auth0Id: setupAdminAuth0Id,
        email: setupEmail,
        name: 'Admin',
        role: roleAdminDB._id,
      });
      await newUserAdmin.save();
      console.log('Roles y usuarios inicializados');
    }
  } catch (error) {
    console.log(error);
    console.log('Error al iniciar los roles de usuario');
  }
};

initializeSetup();
