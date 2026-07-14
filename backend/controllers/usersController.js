const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // No devolvemos la contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

// PUT /users/:id/change-password
async function changePassword(req, res) {
  const userId      = Number(req.params.id);
  const { oldPass, newPass } = req.body;

  try {
    // 1) Obtener usuario
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // 2) Verificar rol o propietario
    if (req.user.role !== "ADMIN" && req.user.userId !== userId) {
      return res.status(403).json({ error: "Sin permiso para cambiar contraseña" });
    }

    // 3) Si no es ADMIN, verifica la contraseña antigua
    if (req.user.role !== "ADMIN") {
      const ok = await bcrypt.compare(oldPass, user.password);
      if (!ok) return res.status(400).json({ error: "Contraseña antigua incorrecta" });
    }

    // 4) Hashear y actualizar
    const hash = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { id: userId },
      data:  { password: hash }
    });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error en changePassword:", err);
    res.status(500).json({ error: "Error al cambiar contraseña" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword
};
