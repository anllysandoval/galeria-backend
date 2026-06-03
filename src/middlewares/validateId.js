import mongoose from 'mongoose';

function idMongoDbValidator(id) {
  if (!id || id.trim().length !== 24) return false;
  const isValidHex = /^[0-9a-fA-F]{24}$/.test(id.trim());
  if (!isValidHex) return false;

  const reservedIds = [
    '000000000000000000000000',
    'ffffffffffffffffffffffff',
    'deadbeefdeadbeefdeadbeef',
  ];
  if (reservedIds.includes(id.trim().toLowerCase())) return false;

  return true;
}

export const validateId = (req, res, next) => {
  try {
    const { id } = req.params;
    if (!idMongoDbValidator(id))
      return res.status(400).json({ message: ['ID inválido o longitud incorrecta'] });

    const cleanId = id.trim();
    if (!mongoose.isValidObjectId(cleanId))
      return res.status(400).json({ message: ['Formato de id no válido para MongoDB'] });

    const objectId = mongoose.Types.ObjectId.createFromHexString(cleanId);
    if (objectId.toString() !== cleanId.toLowerCase())
      return res.status(400).json({ message: ['Error al procesar el ID'] });

    next();
  } catch (error) {
    return res.status(400).json({ message: ['El id no es un ObjectId válido'] });
  }
};
