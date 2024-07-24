import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.DB_MONGO;

export const conectarDB = async () => {
    if (!uri) {
        console.log('La URI de la base de datos no está definida en las variables de entorno.');
        process.exit(1); // detener la app
    }

    mongoose.set('strictQuery', false);

    try {
        await mongoose.connect(uri);
        console.log('Base de datos conectada');
    } catch (error) {
        console.log('Hubo un error con la conexión a la base de datos');
        console.log(error);
        process.exit(1); // detener la app
    }
};


