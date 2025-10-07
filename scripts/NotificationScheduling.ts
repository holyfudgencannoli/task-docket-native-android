import { TimestampTrigger, TriggerType } from '@notifee/react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

export async function createChannel() {
        await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });
    }

export async function scheduleNotification(timestamp, title, body) {
        // Fire 5 seconds from now (for example)
        createChannel()
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: (timestamp),
            repeatFrequency: undefined, // optional: DAILY, WEEKLY
        };
        const date = new Date(timestamp);

        await notifee.createTriggerNotification(
            {
                title: title,
                body: body,
                android: {
                    channelId: 'default',
                },
            },
            trigger
        );

        console.log('Notification scheduled for:', date);
    }

