import { Schema, model, Document } from "mongoose";

interface IReserva extends Document {
    fecha: Date;
    abono: number;
    precio: number;
    cliente: Schema.Types.ObjectId ;
    espacioAlquilado: string;
    establecimiento: Schema.Types.ObjectId;
    nombreUsuario: string;
    registro: Date;
    actualizacion: Date;
    estado: string;
  }
  
  // Definición del documento de Reserva (usando Document)
const ReservasSchema = new Schema<IReserva>({
    fecha: {
        type: Date,
        required: true,
      },
    abono:{
        type: Number,
        require: true,
    },
    precio:{
        type: Number,
        require: true,
    },
    cliente:{
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        require: true,
    },
    espacioAlquilado: {
        type: String,
        require: true,
    },
    establecimiento: {
        type: Schema.Types.ObjectId,
        ref: 'Establecimiento',
        require: true,
    },
    nombreUsuario:{
        type: String,
        require:true,
        trim: true
    },
    registro:{
        type: Date,
        default: new Date()
    },
    actualizacion:{
        type: Date,
        default: new Date() ,
        index: true,
    },
    estado:{
        type: String,
        require:true,
        trim: true

    }
});


ReservasSchema.index({ fecha: 1 });

// Definición del modelo de Reserva (usando model)
const ReservaModel = model<IReserva>('Reserva', ReservasSchema);

export default ReservaModel;