import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { Surface, TextInput } from 'react-native-paper';
import { ThemedText } from '../../components/ThemedText';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useAuth } from '../../scripts/AuthContext';
import { ThemedView } from '../../components/ThemedView';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from "expo-notifications";
import { scheduleNotification } from '../../scripts/NotificationScheduling';


export default function TaskInput() {
    const { user, token } = useAuth();

    const [taskName, setTaskName] = useState('');
    const [dueDatetime, setDueDatetime] = useState(new Date());
    const [logDatetime, setLogDatetime] = useState(new Date());



  // Update logDatetime every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLogDatetime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // DateTimePicker handlers
  const onChangeDue = (event, selectedDate) => {
    if (selectedDate) setDueDatetime(selectedDate);
  };

  const showPicker = (mode) => {
    DateTimePickerAndroid.open({
      value: dueDatetime,
      onChange: onChangeDue,
      mode,
      is24Hour: false,
    });
  };

  const showDatePicker = () => showPicker('date');
  const showTimePicker = () => showPicker('time');

  const setDueDateNow = () => setDueDatetime(new Date());

  // Submit task to backend
  const handleSubmit = async () => {
    if (!taskName) return;

    const payload = {
      user_id: String(user?.id),
      name: taskName,
      due_datetime: dueDatetime.toISOString(),
      log_datetime: logDatetime.toISOString(),
      fin_datetime: '',
      completed: false,
      memo: '',
    };

    console.log('Payload:', payload);

    try {
        const response = await fetch('https://react-tasks-online.onrender.com/api/log-tasks', {
            method: 'POST',
            headers: {
            Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('Task log response:', data);

        if (data.success) {
            scheduleNotification(dueDatetime.getTime(), "Upcoming Task Reminder", `"${taskName}" deadline coming up. Don't forget to finish by ${dueDatetime.toLocaleString()}`)
            setTaskName('');
            setDueDatetime(new Date());
        }
    } catch (error) {
      console.error('Error submitting task:', error);
    }

  };

  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80} // adjust if header overlaps inputs
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                keyboardShouldPersistTaps="handled"
            >
                <Surface style={styles.surface}>
                    <ThemedText style={styles.label}>Task Name</ThemedText>
                    <TextInput
                        
                        value={taskName}
                        onChangeText={setTaskName}
                        placeholder="Enter task name"
                        style={styles.input}
                />
                </Surface>

                    {Platform.OS === 'ios' ? (
                        <Surface style={[styles.datetimePickerIosContainer, styles.surface]} >
                            <ThemedText style={styles.label}>Due</ThemedText>
                            <DateTimePicker
                                value={dueDatetime}
                                onChangeDue={setDueDatetime}
                                mode='datetime'
                            />
                        </Surface>
                    ) : (
                        <>
                            <Surface style={styles.surface}>
                                <ThemedText style={styles.label}>{dueDatetime.toLocaleString()}</ThemedText>
                            </Surface>
                            <ThemedView style={styles.buttonsDatetime}>
                                <Button color={'#000080'} onPress={showDatePicker} title="Pick Date" />
                                <Button color={'#000080'} onPress={showTimePicker} title="Pick Time" />
                            </ThemedView> 
                        </>
                )}              

                <Surface style={styles.surface}>
                    <ThemedText style={styles.label}>Log</ThemedText>
                    <ThemedText style={styles.label}>{logDatetime.toLocaleString()}</ThemedText>
                </Surface>

                <Surface style={styles.surface}>
                    <Button color={'#000080'} style={styles.button} onPress={handleSubmit} title="Submit" />
                    <Button color={'#000080'} style={styles.button} onPress={setDueDateNow} title="Set Due to Now" />            
                </Surface>
            </ScrollView>
        </KeyboardAvoidingView>
                
            
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 16,
  },
  buttonsDatetime: {
    display: 'flex',
    flexDirection:'row',
    margin: 'auto',
    gap: 48

  },
  buttonsForm: {
    display: 'flex',
    flexDirection:'column',
    margin: 'auto',
    gap: 48

  },
  button: {
    backgroundColor: 'black'
  },
  label: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center'
  },
  input: {
    margin: 12,
    // gap: 15
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  dropdownContainer: {
    backgroundColor: '#e3e3e3',
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
    padding:16
  },
  frequencyInputLabel: {
    textAlign: 'center'
  }
});
