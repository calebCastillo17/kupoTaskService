import { conectarDB } from './config/database';
import './tasks/cron'; // Importa las tareas programadas
import './models/Clientes'; // Importa para registrar el modelo
import './models/Reservas'; // Importa para registrar el modelo
const start = async () => {
  await conectarDB();
  console.log('Database connected and cron jobs scheduled');
};

start();