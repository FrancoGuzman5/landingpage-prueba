const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validarContrasena } = require("../utils/password");
const { enviarRecuperacion } = require("../services/email");

// Una hora: el correo sale desde onboarding@resend.dev y suele caer en spam
// hasta que el dominio esté verificado, así que la persona puede tardar en
// encontrarlo. Más corto se vuelve frustrante; más largo, un enlace olvidado
// en una bandeja queda útil demasiado tiempo.
const MINUTOS_VIGENCIA_ENLACE = 60;

// SHA-256 y no bcrypt para el token: bcrypt existe para frenar ataques de
// fuerza bruta contra contraseñas humanas, que son adivinables. Este token son
// 32 bytes aleatorios (256 bits): no hay nada que adivinar. Y hace falta
// buscarlo por su hash, cosa imposible con bcrypt, que da un hash distinto
// cada vez.
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // El formulario solo revisaba que las dos contraseñas coincidieran; el
  // servidor no validaba nada y se podía crear una cuenta con "a" o vacía.
  const errorPassword = validarContrasena(password);
  if (errorPassword) return res.status(400).json({ error: errorPassword });

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
      // Con la variable sin definir, jwt.sign recibe undefined y emite un
      // token SIN caducidad: si se filtra, vale para siempre. El fallback
      // garantiza que todo token tenga vencimiento.
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
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

// Actualiza los datos del usuario autenticado (su propio perfil).
// El id sale del token, así solo puede editar lo suyo.
const updateMe = async (req, res) => {
  const userId = req.user.userId;
  const { name, phone } = req.body;
  try {
    const data = {};
    if (name !== undefined) data.name = name;
    if (phone !== undefined) data.phone = phone;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(user);
  } catch (err) {
    console.error("Error en updateMe:", err);
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};

/**
 * POST /auth/forgot-password  { email }
 *
 * Responde SIEMPRE lo mismo, exista o no la cuenta. Si dijera "ese correo no
 * está registrado", cualquiera podría usar este formulario para averiguar
 * quién tiene cuenta, y esa lista sirve para ataques dirigidos.
 */
const solicitarRecuperacion = async (req, res) => {
  const respuesta = {
    message:
      "Si existe una cuenta con ese correo, te enviamos un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.",
  };

  const email = String(req.body?.email ?? "").trim();
  if (!email) return res.status(400).json({ error: "Escribe tu correo electrónico." });

  try {
    // Sin distinguir mayúsculas: quien escribió "Franco@Gmail.com" al
    // registrarse no tiene por qué recordar exactamente cómo lo escribió.
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (user) {
      const token = crypto.randomBytes(32).toString("base64url");
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetTokenHash: hashToken(token),
          resetTokenExpira: new Date(Date.now() + MINUTOS_VIGENCIA_ENLACE * 60 * 1000),
        },
      });

      const base = process.env.FRONTEND_URL || "http://localhost:3000";
      const enlace = `${base}/restablecer?token=${encodeURIComponent(token)}`;

      // Sin await, igual que el aviso de reservas. Además de no hacer esperar,
      // cierra una fuga más sutil: si se esperara al correo, la respuesta
      // tardaría notoriamente más cuando la cuenta existe, y midiendo tiempos
      // se podría averiguar lo mismo que el mensaje genérico busca ocultar.
      enviarRecuperacion({
        email: user.email,
        nombre: user.name,
        enlace,
        minutos: MINUTOS_VIGENCIA_ENLACE,
      }).catch((err) => console.error("[email] Recuperación falló:", err));
    }

    res.json(respuesta);
  } catch (err) {
    console.error("Error en solicitarRecuperacion:", err);
    res.status(500).json({ error: "No se pudo procesar la solicitud." });
  }
};

/**
 * POST /auth/reset-password  { token, password }
 */
const restablecerContrasena = async (req, res) => {
  const token = String(req.body?.token ?? "");
  const { password } = req.body ?? {};

  if (!token) return res.status(400).json({ error: "Falta el enlace de recuperación." });

  const errorPassword = validarContrasena(password);
  if (errorPassword) return res.status(400).json({ error: errorPassword });

  // Un solo mensaje para enlace inexistente, vencido o ya usado: distinguirlos
  // no le sirve a quien lo usa bien, y a quien prueba tokens le daría pistas.
  const invalido = {
    error: "Este enlace no es válido o ya venció. Pide uno nuevo desde \"¿Olvidaste tu contraseña?\".",
  };

  try {
    const user = await prisma.user.findUnique({
      where: { resetTokenHash: hashToken(token) },
    });
    if (!user || !user.resetTokenExpira || user.resetTokenExpira < new Date()) {
      return res.status(400).json(invalido);
    }

    // La contraseña nueva y el borrado del token van en la misma operación:
    // el enlace deja de servir en el mismo instante en que se usa. Si fueran
    // dos pasos y el segundo fallara, el enlace seguiría vivo.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(password, 10),
        resetTokenHash: null,
        resetTokenExpira: null,
      },
    });

    res.json({ message: "Tu contraseña se actualizó. Ya puedes ingresar con la nueva." });
  } catch (err) {
    console.error("Error en restablecerContrasena:", err);
    res.status(500).json({ error: "No se pudo actualizar la contraseña." });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  solicitarRecuperacion,
  restablecerContrasena,
};