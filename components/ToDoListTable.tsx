import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Animated, Alert } from 'react-native';
import { useAuth } from '../scripts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

interface Task {
  id: number;
  name: string;
  due_datetime: string;
  fin_datetime: string | null;
  completed: boolean;
}

export default function ToDoListNative() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  // Animated values per task for strikethrough
  const animatedValues = useRef<Record<number, Animated.Value>>({}).current;

  const fetchTasks = async () => {
    try {
      const res = await fetch('https://react-tasks-online.onrender.com/api/get-tasks-to-do', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      Alert.alert('Error', 'Failed to load tasks');
    }
  };

  useLayoutEffect(() => {
    fetchTasks();
  }, []);

  useFocusEffect(
          useCallback(() => {
              fetchTasks();
          }, [])
      );
  

  const markComplete = async (task: Task) => {
    if (task.completed) return;

    // Animate strikethrough
    if (!animatedValues[task.id]) animatedValues[task.id] = new Animated.Value(0);
    Animated.timing(animatedValues[task.id], {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t))
    );

    setTimeout(async() => {
        await fetch('https://react-tasks-online.onrender.com/api/mark-complete', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({ task_id: task.id }),
        }); 
        fetchTasks()
    }, 2000);
      
  };

  const renderTask = ({ item }: { item: Task }) => {
    if (!animatedValues[item.id]) animatedValues[item.id] = new Animated.Value(item.completed ? 1 : 0);

    const strikeWidth = animatedValues[item.id].interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.taskRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskText, item.completed && { color: '#888' }]}>{item.name}</Text>
          <Text style={styles.subText}>Due: {new Date(item.due_datetime).toLocaleString()}</Text>
          <Text style={styles.subText}>
            Completed: {item.fin_datetime ? new Date(item.fin_datetime).toLocaleString() : 'Not completed yet'}
          </Text>
          <Animated.View style={[styles.strike, { width: strikeWidth }]} />
        </View>
        {!item.completed && <Button title="Done" onPress={() => markComplete(item)} />}
      </View>
    );
  };

  function handleComplete(item) {
    markComplete(item)
    
    setTimeout(() => {
    }, 2800)
  }

  const start = page * itemsPerPage;
  const end = start + itemsPerPage;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ToDo List</Text>
      <FlatList
        data={tasks.slice(start, end)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTask}
      />
      <View style={styles.pagination}>
        <Button disabled={page === 0} title="Prev" onPress={() => setPage(page - 1)} />
        <Text>
          {start + 1}-{Math.min(end, tasks.length)} of {tasks.length}
        </Text>
        <Button
          disabled={end >= tasks.length}
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
});
