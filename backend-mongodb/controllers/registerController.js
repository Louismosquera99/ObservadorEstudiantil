import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/sendEmail.js';

export const register = async (req, res) => {
  const {
    nombre,
    apellido,
    tipoIdentificacion,
    numIdentificacion,
    correo,
    grado,
    rol
  } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (
    !nombre ||
    !apellido ||
    !tipoIdentificacion ||
    !numIdentificacion ||
    !correo ||
    !grado ||
    !rol
  ) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si ya existe un usuario con ese correo
    const existingUser = await User.findOne({ correo });

    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(numIdentificacion, 10);

    // Crear nuevo usuario
    const newUser = new User({
      nombre,
      apellido,
      tipoIdentificacion,
      numIdentificacion,
      correo,
      grado,
      password: hashedPassword,
      rol
    });

    await newUser.save();

    // Enviar correo de bienvenida
    const html = `
      <h2>¡Bienvenido a Observador Estudiantil, ${nombre} ${apellido}!</h2>
      <p>Tu cuenta ha sido creada exitosamente con el correo <strong>${correo}</strong>.</p>
      <p>Recuerda que tu contraseña es el numero de documento de identidad para ingresar a la plataforma.</p>
      <p>Gracias por confiar en nosotros.</p>
    `;

    await sendEmail(correo, '🎉 Bienvenido Observador Estudiantil', html);

    // Enviar datos de usuario sin contraseña
    const userWithoutPassword = {
      _id: newUser._id,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      correo: newUser.correo,
      rol: newUser.rol,
      grado: newUser.grado,
    };

    

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
