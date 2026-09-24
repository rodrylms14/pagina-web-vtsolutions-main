const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: 'El correo ya está registrado'
      });
    }

    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente',
      data: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        ok: false,
        message: 'Contraseña incorrecta'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Login exitoso',
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login
};