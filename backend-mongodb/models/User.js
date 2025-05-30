import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    tipoIdentificacion: {
      type: String,
      required: true,
    },
    numIdentificacion: {
      type: Number,
      required: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    grado: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ["admin", "docente", "alumno"],
      required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);

export default User;
