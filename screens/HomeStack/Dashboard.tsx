import { ThemedText } from "../../components/ThemedText";
import { Button, FlatList, SafeAreaView, View } from "react-native";
import { useAuth } from "../../scripts/AuthContext";
import { Surface } from "react-native-paper";
import { StyleSheet } from "react-native";
import {BarChart} from 'react-native-gifted-charts'
import { useCallback, useLayoutEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { TimestampTrigger, TriggerType } from '@notifee/react-native';
import notifee from '@notifee/react-native';


export default function Dashboard() {
    const { user, token } = useAuth()
    const [tasksToday, setTasksToday] = useState([])

    async function scheduleNotification() {
        // Fire 5 seconds from now (for example)
        const date = new Date(Date.now() + 5000);

        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: date.getTime(),
            repeatFrequency: undefined, // optional: DAILY, WEEKLY
        };

        await notifee.createTriggerNotification(
            {
            title: 'Scheduled Notification',
            body: 'This will appear at the scheduled time',
            android: {
                channelId: 'default',
            },
            },
            trigger
        );

        console.log('Notification scheduled for:', date);
    }



    const fetchTodaysTasks = async () => {
        const res = await fetch('https://react-tasks-online.onrender.com/api/get-tasks-today', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/js' },
            credentials: 'include',
        });
        const data = await res.json();
        const incompleteTasks = data.tasks.filter(task => task.completed === false);

        setTasksToday(incompleteTasks);
    }
    

    useLayoutEffect(() => {
        fetchTodaysTasks();
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchTodaysTasks();
        }, [])
    );

    // const data = tasksToday.map((task) => ({
    //     id: task.id,
    //     name: task.name,
    //     dueDatetime: new Date(task.due_datetime).toLocaleString("en-GB", {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         month: 'short',
    //         day: 'numeric',
    //         hour12: true
    //     }),
        
    //     logTime: task.log_datetime ? new Date(task.log_datetime).toLocaleString("en-GB", {
    //         month: 'short',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         hour12: true,
    //     }) : 'Not completed yet',
    // }))



    return(
        <>
            <View style={styles.container}>
                <ThemedText style = {styles.listTitle}>
                    Tasks Due Today
                </ThemedText>
            <View>
                <Button title="press" onPress={scheduleNotification} />
                <FlatList
                    style={styles.list}
                    data={tasksToday}
                    renderItem={({item}) => (
                        <View style={styles.taskRow}>
                            <ThemedText style={styles.listItem}>{item.name}</ThemedText>
                            <ThemedText>Due: {new Date(item.due_datetime).toLocaleTimeString("en-GB", {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}</ThemedText>
                            <ThemedText>Logged: {new Date(item.log_datetime).toLocaleString("en-GB", {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}</ThemedText>
                        </View>
                    )}
                >

                </FlatList>
            </View>
        </View>

        </>      
    )
    
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },

  button:{
    color: 'black'
  },
  reactLogo: {
    height: 360,
    width: 420,
    bottom: 0,
    left: -10,
    position: 'absolute',
    alignItems: 'center'
  },
  listTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 28,
    padding: 36,

    
  },
  list: {
    // padding:32
  },
  listItem: {
    fontSize: 24,

    margin: 8
  },
  taskRow: {
    backgroundColor: '#fff',
    flexDirection: 'cloumn',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  }
});
