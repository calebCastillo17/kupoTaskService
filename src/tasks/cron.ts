import cron from 'node-cron';
import { notificarPeloteroPrevio, desecharReservasPasadas } from './task';

// Tarea programada para crear una tarea cada minuto

// Programa el envío de notificaciones cada hora
cron.schedule('37 * * * *', async() => {
    // Lógica para enviar las notificaciones push aquí
    console.log('Listing tasks every 01 minutes');

    await notificarPeloteroPrevio('Recordatorio', 'No olvides que tienes partido en una hora')
  });


  cron.schedule('55 * * * *', async() => {
    // Lógica para enviar las notificaciones push aquí
    console.log('Listing tasks every 55 minutes');

    await notificarPeloteroPrevio('Recordatorio', '¡Prepárate! en cinco minutos empieza tu partido')
  });


// Tarea programada para listar tareas cada 5 minutos


cron.schedule('0 02 * * *', async () => {
    console.log('Ejecutando tarea de eliminación de reservas a las 5 p.m.');

    await desecharReservasPasadas()
});