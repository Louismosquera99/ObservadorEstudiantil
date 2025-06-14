import mongoose from "mongoose";

const seguimientoSchema = new mongoose.Schema(
  {
    quien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    comentario: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const respuestaEstudianteSchema = new mongoose.Schema(
  {
    respuesta: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const observationSchema = new mongoose.Schema(
  {
    estudiante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    tipo: {
      type: String,
      enum: ["academica", "comportamentalPositiva", "comportamentalNegativa"],
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "enSeguimiento", "resuelta"],
      default: "pendiente",
    },
    seguimientos: [seguimientoSchema],
    respuestasEstudiante: [respuestaEstudianteSchema],
  },
  {
    timestamps: true,
  }
);

const Observation = mongoose.model("Observations", observationSchema);

export default Observation;
