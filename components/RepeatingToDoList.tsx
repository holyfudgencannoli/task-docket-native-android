import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Animated, Alert } from 'react-native';
import { useAuth } from '../scripts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';



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
  completed_for_period: boolean;
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
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<RepeatingTask[]>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  // Animated values per task for strikethrough
  const animatedValues = useRef<Record<number, Animated.Value>>({}).current;

  const fetchTasks = async () => {
    try {
      const res = await fetch('https://react-tasks-online.onrender.com/api/repeating-tasks', {
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
    // const res = await fetch('https://react-tasks-online.onrender.com/api/repeating-tasks', {
    //     method: 'GET',
    //     headers: { Authorization: `Bearer ${token}` },
    //     credentials: 'include',
    // });
    // const data = await res.json();
    // console.log("Fetched data:", data);
  };

  useLayoutEffect(() => {
    fetchTasks();
  }, []);

  useFocusEffect(
          useCallback(() => {
              fetchTasks();
          }, [])
      );

  

    const markComplete = async (task: RepeatingTask) => {
        if (task.completed_for_period) return;

        if (!animatedValues[task.id]) animatedValues[task.id] = new Animated.Value(0);

        Animated.timing(animatedValues[task.id], {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
        }).start(() => {
            // After animation completes, move task to bottom
            setTasks((prev) => {
            const updated = prev.map((t) =>
                t.id === task.id ? { ...t, completed_for_period: true } : t
            );
            const incomplete = updated.filter((t) => !t.completed_for_period);
            const complete = updated.filter((t) => t.completed_for_period);
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
    };


  const renderTask = ({ item }: { item: RepeatingTask }) => {
    if (!animatedValues[item.id]) animatedValues[item.id] = new Animated.Value(item.completed_for_period ? 1 : 0);

    const strikeWidth = animatedValues[item.id].interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.taskRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskText, item.completed_for_period && { color: '#888' }]}>{item.name}</Text>
          <Text style={styles.subText}>Next Due: {new Date(item.next_due).toLocaleString()}</Text>
          <Text style={styles.subText}>
            Last Completed: {item.last_completed ? new Date(item.last_completed).toLocaleString() : 'Not completed yet'}
          </Text>
          <Animated.View style={[styles.strike, { width: strikeWidth }]} />
        </View>
        {<Button title="Done" onPress={() => markComplete(item)} />}
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
