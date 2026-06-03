import User from '../models/user.models.js';
import Role from '../models/roles.models.js';
import dotenv from 'dotenv';

dotenv.config();

// Crea un usuario si no existe (se llama desde el callback de Auth0)
export const createUser = async (req, res) => {
  try {
    const { auth0Id, email } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) return res.status(200).json(existingUser);

    // Asignar rol de usuario por defecto
    const roleUser = process.env.SETUP_ROLE_USER;
    const role = await Role.findOne({ role: roleUser });
    if (!role)
      return res.status(400).json({ message: ['El rol para usuarios no está definido'] });

    const newUser = new User({ auth0Id, email, role: role._id });
    await newUser.save();
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al crear el usuario'] });
  }
};

// Actualiza nombre del usuario
export const updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: ['Usuario no encontrado'] });

    user.name = name;
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al actualizar usuario'] });
  }
};

// Obtiene los datos del usuario autenticado
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: ['Usuario no encontrado'] });

    const role = await Role.findById(user.role);
    res.json({
      _id: user._id,
      auth0Id: user.auth0Id,
      email: user.email,
      name: user.name,
      role: role ? role.role : 'user',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al obtener datos del usuario'] });
  }
};
