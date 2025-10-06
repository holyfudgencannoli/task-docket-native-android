import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Animated, Alert, Modal, Pressable } from 'react-native';
import { useAuth } from '../scripts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { Surface, TextInput } from 'react-native-paper';
import { ThemedText } from './ThemedText';


export interface RepeatingTask {
  id: number;
  name: string;
  created_at: string;            
  frequency_seconds: number;            
  first_due: string;             
  next_due: string;              
  last_completed: string | null; 
  memo: string | null;           
  high_priority: boolean;
  user_id: number;
}

function formatFrequency(seconds: number): string {
  const weeks = Math.floor(seconds / (7 * 24 * 3600));
  const days = Math.floor((seconds % (7 * 24 * 3600)) / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let parts: string[] = [];
  if (weeks) parts.push(`${weeks}w`);
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  return parts.length ? parts.join(" ") : "0m";
}


export default function RepeatingoDoListNative() {
  const { token } = useAuth();
  const [repeatingTasks, setRepeatingTasks] = useState<RepeatingTask[]>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;
  const [modalVisible, setModalVisible] = useState(false);
//   const [isCompletedForPeriod, setIsCompletedForPeriod] = useState(false)

  // Animated values per task for strikethrough
  const animatedValues = useRef<Record<number, Animated.Value>>({}).current;

  const fetchRepeatingTasks = async () => {
    try {
      const res = await fetch('https://react-tasks-online.onrender.com/api/repeating-tasks', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch repeatingTasks');
      const data = await res.json();
      setRepeatingTasks(data.tasks || []);
    } catch (err) {
      console.error('Error fetching repeatingTasks:', err);
      Alert.alert('Error', 'Failed to load repeatingTasks');
    }
    // const res = await fetch('https://react-tasks-online.onrender.com/api/repeating-tasks', {
    //     method: 'GET',
    //     headers: { Authorization: `Bearer ${token}` },
    //     credentials: 'include',
    // });
    // const data = await res.json();
    // console.log("Fetched data:", data);
  };

  useLayoutEffect(() => {
    fetchRepeatingTasks();
  }, []);

  useFocusEffect(
          useCallback(() => {
              fetchRepeatingTasks();
          }, [])
      );

  

    const markComplete = async (task: RepeatingTask) => {
        if (CheckCompletionForPeriod(task)) return;

        if (!animatedValues[task.id]) animatedValues[task.id] = new Animated.Value(0);

        Animated.timing(animatedValues[task.id], {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
        }).start(() => {
            // After animation completes, move task to bottom
            setRepeatingTasks((prev) => {
            const updated = prev.map((t) =>
                t.id === task.id ? { ...t, last_completed: new Date().toISOString(), next_due: new Date(new Date(t.next_due).getTime()).toISOString() } : t
            );
            const incomplete = updated.filter((t) => !CheckCompletionForPeriod(t));
            const complete = updated.filter((t) => CheckCompletionForPeriod(t));
            return [...incomplete, ...complete];
            });
        });

        // Tell backend it’s complete
        try {
            await fetch('https://react-tasks-online.onrender.com/api/mark-complete-repeating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({ task_id: task.id }),
            });
        } catch (err) {
            console.error('Error marking complete:', err);
        }
        setRepeatingTasks((prev) => {
            const updated = prev.map((t) =>
                t.id === task.id ? { ...t, last_completed: new Date().toISOString(), next_due: new Date(new Date(t.next_due).getTime() + (t.frequency_seconds * 1000)).toISOString() } : t
            );
            const incomplete = updated.filter((t) => !CheckCompletionForPeriod(t));
            const complete = updated.filter((t) => CheckCompletionForPeriod(t));
            return [...incomplete, ...complete];
        });
    };

    
    // async function editRepeatingTask(task: RepeatingTask) {
    //     try {
    //         await fetch(`https://react-tasks-online.onrender.com/api/repeating-tasks/${task.id}`, {
    //             method: 'PUT',   
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`
    //             },
    //             credentials: 'include',
    //             body:
    //         });
    //     } catch (err) {
    //         console.error('Error marking complete:', err.message);
    //     }
    //     fetchRepeatingTasks()
    // }
    

    async function deleteRepeatingTask(task: RepeatingTask) {
        try {
            await fetch(`https://react-tasks-online.onrender.com/api/repeating-tasks/${task.id}`, {
                method: 'DELETE',   
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                credentials: 'include'
            });
        } catch (err) {
            console.error('Error marking complete:', err.message);
        }
        fetchRepeatingTasks()
    }

    function CheckCompletionForPeriod(task: RepeatingTask): boolean {
        if (!task.last_completed) return false; // never completed before

        const today = new Date()
        const todaySec = today.getTime() / 1000
        const nextDue = new Date(task.next_due)
        const nextDueSec = nextDue.getTime() / 1000
        const frequencySec = task.frequency_seconds
        const lastCompleted = new Date(task.last_completed)
        const lastCompletedSec = lastCompleted.getTime() /1000
        const periodStart = nextDueSec - frequencySec

        return lastCompletedSec <= periodStart
    }


    const renderTask = ({ item }: { item: RepeatingTask }) => {
        const completed = CheckCompletionForPeriod(item);

        if (!animatedValues[item.id]) {
            animatedValues[item.id] = new Animated.Value(completed ? 1 : 0);
        }

        const strikeWidth = animatedValues[item.id].interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
        });

        return (
            <View style={styles.taskRow}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.taskText, completed && { color: '#888' }]}>{item.name}</Text>
                    <Text style={styles.subText}>
                    Frequency: {formatFrequency(item.frequency_seconds)}
                    </Text>
                    <Text style={styles.subText}>
                    Next Due: {new Date(item.next_due).toLocaleString()}
                    </Text>
                    <Text style={styles.subText}>
                    Last Completed: {item.last_completed ? new Date(item.last_completed).toLocaleString() : 'Not completed yet'}
                    </Text>
                    <Text style={styles.subText}>
                    Completed For Period?: {CheckCompletionForPeriod(item) ? "Yes" : "No"}
                    </Text>
                    <Animated.View style={[styles.strike, { width: strikeWidth }]} />
                </View>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* <Button title="Edit" onPress={() => setModalVisible(true)} /> */}
                    <Button title="Delete" onPress={() => deleteRepeatingTask(item)} />

                    {!completed && (
                        <Button title="Done" onPress={() => markComplete(item)} />
                    )}
                </View>
                
            </View>
        );
    };

    const [taskName, setTaskName] = useState('');
    const [dueDatetime, setDueDatetime] = useState(new Date ());
    const [frequencyWeeks, setFrequencyWeeks] = useState(0);
    const [frequencyDays, setFrequencyDays] = useState(0);
    const [frequencyHours, setFrequencyHours] = useState(0);
    const [frequencyMinutes, setFrequencyMinutes] = useState(0);
    const [memo, setMemo] = useState(null);
    const [highPriority, setHighPriority] = useState(null);
    const [count, setCount] = useState(0);
    

  function handleComplete(item) {
    markComplete(item)
    
    setTimeout(() => {
    }, 2800)
  }

  const start = page * itemsPerPage;
  const end = start + itemsPerPage;

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Recurring Tasks</Text>
        <FlatList
            data={repeatingTasks.slice(start, end)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTask}
        />
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>S
                    <Text style={styles.modalText}>Edit Recurring Task Below</Text>
                    <Surface>
                        <Surface style={styles.surface}>
                            <TextInput
                                value={taskName}
                                onChangeText={setTaskName}
                                placeholder="Update Task Name"
                                style={styles.input}
                                mode='outlined'
                            />
                        </Surface>
                        <Surface style={styles.surface}>
                            <TextInput
                                value={taskName}
                                onChangeText={setTaskName}
                                placeholder="Update Next Due Date"
                                style={styles.input}
                                mode='outlined'
                            />
                        </Surface>
                        <Surface style={styles.surface}>
                            <TextInput
                                value={taskName}
                                onChangeText={setTaskName}
                                placeholder="Enter task name"
                                style={styles.input}
                                mode='outlined'
                            />
                        </Surface>
                        <Surface style={styles.surface}>

                            <TextInput
                                value={taskName}
                                onChangeText={setTaskName}
                                placeholder="Enter task name"
                                style={styles.input}
                                mode='outlined'
                            />
                        </Surface>
                        <Surface style={styles.surface}>
                            <ThemedText style={styles.frequencyTitle}>
                                Frequency
                            </ThemedText>
                            {/* <ThemedText style={styles.frequencySubtitle}>
                                (How often?)
                            </ThemedText> */}
                            <Surface style={styles.frequencyInputContainer}>
                                <Surface>
                                    <ThemedText style={styles.frequencyInputLabel}>
                                        Weeks
                                    </ThemedText>
                                    <TextInput
                                        style={styles.input}
                                        value={frequencyWeeks}
                                        onChangeText={(text) => {
                                            // Remove all non-numeric characters
                                            const numericText = text.replace(/[^0-9]/g, '');
                                            setFrequencyWeeks(numericText);
                                        }}
                                        keyboardType="numeric"
                                    />
                                </Surface>
                                <Surface>
                                    <ThemedText style={styles.frequencyInputLabel}>
                                        Days
                                    </ThemedText>
                                    <TextInput
                                        style={styles.input}
                                        value={frequencyDays}
                                        onChangeText={(text) => {
                                            // Remove all non-numeric characters
                                            const numericText = text.replace(/[^0-9]/g, '');
                                            setFrequencyDays(numericText);
                                        }}
                                        keyboardType="numeric"
                                    />
                                </Surface>
                                <Surface>
                                    <ThemedText style={styles.frequencyInputLabel}>
                                        Hours
                                    </ThemedText>
                                    <TextInput
                                        style={styles.input}
                                        value={frequencyHours}
                                        onChangeText={(text) => {
                                            // Remove all non-numeric characters
                                            const numericText = text.replace(/[^0-9]/g, '');
                                            setFrequencyHours(numericText);
                                        }}
                                        keyboardType="numeric"
                                    />
                                </Surface>
                                <Surface>
                                    <ThemedText style={styles.frequencyInputLabel}>
                                        Minutes
                                    </ThemedText>
                                    <TextInput
                                        style={styles.input}
                                        value={frequencyMinutes}
                                        onChangeText={(text) => {
                                            // Remove all non-numeric characters
                                            const numericText = text.replace(/[^0-9]/g, '');
                                            setFrequencyMinutes(numericText);
                                        }}
                                        keyboardType="numeric"
                                    />
                                </Surface>
                            </Surface>
                        </Surface>
                    </Surface>
                    
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
        <View style={styles.pagination}>
            <Button disabled={page === 0} title="Prev" onPress={() => setPage(page - 1)} />
            <Text>
                {repeatingTasks.length === 0 ? "No repeatingTasks" : `${start + 1}-${Math.min(end, repeatingTasks.length)} of ${repeatingTasks.length}`}
            </Text>
            <Button
            disabled={end >= repeatingTasks.length}
            title="Next"
            onPress={() => setPage(page + 1)}
            />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  taskText: { fontSize: 18 },
  subText: { fontSize: 14, color: '#555' },
  strike: {
    height: 2,
    backgroundColor: 'black',
    position: 'absolute',
    top: '50%',
    left: 0,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center', // keep vertical center
    alignItems: 'center', // remove this or set to 'stretch'
    paddingHorizontal: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%', // allow full width
    maxWidth: 400, // optional, for tablet/large screens
    alignItems: 'stretch', // key: make children stretch horizontally
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  frequencyInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 'auto',
    backgroundColor: 'black'

  },
  frequencyTitleContainer: {
    margin: 'auto',
  },
  frequencyTitle: {
    fontSize:18,
    padding: 16,
    textAlign:'center'
  },
  datetimePickerIosContainer: {
    alignItems: 'center',
    padding: 16,
  },
  surface: {
    margin: 16,
    padding: 16
  },
  frequencyInputLabel: {
    textAlign: 'center'
  }
});
