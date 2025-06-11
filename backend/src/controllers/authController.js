import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { username: userFromBody, usuario, password } = req.body;
  const username = userFromBody ?? usuario;

  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan credenciales' });
  }

  try {
    const u = await prisma.usuario.findUnique({
      where: { username }
    });
    if (!u) {
      return res.status(404).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const valid = await bcrypt.compare(password, u.password);
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Firmamos el token con el objeto Prisma 'u', no con la variable 'user'
    const token = jwt.sign(
      { id: u.id, username: u.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
