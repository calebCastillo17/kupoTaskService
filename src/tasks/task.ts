import Reserva from '../models/Reservas';
import NotificacionesPush from '../services/NotificacionesPush';

export const notificarPeloteroPrevio = async (title: string, body: string) => {
    const obtenerMisReservasNot = async () => {
        const now = new Date();
        const oneHourLater = new Date(now);
        oneHourLater.setHours(now.getHours() + 1);

        console.log('Fecha actual:', now);
        console.log('Una hora después:', oneHourLater);

        try {
            const reservas: any = await Reserva.find({
                fecha: { $gte: now, $lt: oneHourLater },
                estado: { $ne: 'denegado' },
            })
            .populate({
                path: 'cliente',
                select: 'notificaciones_token',
            })
            .sort({ fecha: 1 })
            .exec();
    
            console.log('Estas son las reservas:', reservas);

            if (!reservas.length) {
                return [];
            }
            const clientesAEnviar = reservas
            .filter((reserva: any) => reserva.cliente && reserva.cliente.notificaciones_token.length > 0 && reserva.cliente.notificaciones_token.length > 0)
            .map((reserva: any) => reserva.cliente.notificaciones_token)
            .flat();
            
            return clientesAEnviar;

        } catch (error) {
            console.log('este es el error: ', error);
            return []; // En caso de error, retorna un array vacío
        }
    }

    const somePushTokens = await obtenerMisReservasNot();
    console.log('Tokens de notificación:', somePushTokens);
    
    if (somePushTokens.length) {
        console.log('Notificaciones enviadas cada hora');
        const message = {
            title, 
            body,
            data: { withSome: 'data' },
        };
        console.log('Fecha actual al enviar notificaciones:', new Date());
        NotificacionesPush(somePushTokens, message);
    } else {
        console.log('No hay tokens de notificación para enviar.')
    }
};

export const desecharReservasPasadas = async() => {
    try {
        // Encuentra y elimina hasta 5 reservas con fecha máxima de 10 días atrás
        const now = new Date();
        const diezDiasAtras = new Date(now);
        diezDiasAtras.setDate(now.getDate() - 15);

        // Encuentra hasta 5 reservas que deben ser eliminadas
        const reservasAEliminar = await Reserva.find({
            fecha: { $lte: diezDiasAtras },
        })
        .exec();
        reservasAEliminar.forEach((reserva) => {
            // console.log('estas ses las reservas a eliminar', reserva.nombreUsuario, reserva.fecha)
        })
        if (reservasAEliminar.length > 0) {
            const idsAEliminar = reservasAEliminar.map(reserva => reserva._id);
            await Reserva.deleteMany({ _id: { $in: idsAEliminar } });
            console.log(`Se eliminaron ${reservasAEliminar.length} reservas.`);
        } else {
            console.log('No se encontraron reservas para eliminar.');
        }
    } catch (error) {
        console.error('Error al eliminar reservas:', error);
    }
}