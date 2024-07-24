import { Expo, ExpoPushMessage, ExpoPushSuccessTicket, ExpoPushErrorReceipt } from 'expo-server-sdk';

// Create a new Expo SDK client
let expo = new Expo();

// Define the type for the push token
type PushToken = string;

// Define the type for the message
interface PushMessage {
    title: string;
    body: string;
    data?: object;
}

async function NotificacionesPush(somePushTokens: PushToken[], message: PushMessage) {
    let messages: ExpoPushMessage[] = [];
    for (let pushToken of somePushTokens) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        messages.push({
            to: pushToken,
            sound: 'default',
            title: message.title,
            body: message.body,
            data: message.data,
        });
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);
    let tickets: (ExpoPushSuccessTicket | ExpoPushErrorReceipt)[] = [];
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
            console.error(error);
        }
    }

    let receiptIds: string[] = [];
    for (let ticket of tickets) {
        // NOTE: Not all tickets have IDs; for example, tickets for notifications
        // that could not be enqueued will have error information and no receipt ID.
        if ('id' in ticket) {
            receiptIds.push((ticket as ExpoPushSuccessTicket).id);
        }
    }

    // let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    // for (let chunk of receiptIdChunks) {
    //     try {
    //         let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
    //         console.log(receipts);

    //         // The receipts specify whether Apple or Google successfully received the
    //         // notification and information about an error, if one occurred.
    //         for (let receiptId in receipts) {
    //             let { status, message, details } = receipts[receiptId];
    //             if (status === 'ok') {
    //                 continue;
    //             } else if (status === 'error') {
    //                 console.error(
    //                     `There was an error sending a notification: ${message}`
    //                 );
    //                 if (details && details.error) {
    //                     // The error codes are listed in the Expo documentation:
    //                     // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    //                     // You must handle the errors appropriately.
    //                     console.error(`The error code is ${details.error}`);
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
}

export default NotificacionesPush;
