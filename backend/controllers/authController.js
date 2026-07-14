const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    // 1) Verificar que no exista usuario con mismo email
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: "Email ya registrado" });
    }

    // 2) Hashear la contraseña
    const hash = await bcrypt.hash(password, 10);

    // 3) Crear usuario
    const user = await prisma.user.create({
      data: { name, email, password: hash, phone },
    });

    // 4) No retornamos password
    const { password: _, ...userSafe } = user;
    res.status(201).json(userSafe);
    console.log("¡Usuario registrado con éxito!")
  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 2) Comparar contraseñas
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 3) Generar JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 4) Devolver token y usuario sin password
    const { password: _, ...userSafe } = user;
    res.json({ token, user: userSafe });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user viene de authMiddleware (userId, role, iat, exp)
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error en getMe:", err);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

module.exports = { register, login, getMe };