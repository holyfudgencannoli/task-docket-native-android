import { ThemedText } from "../../components/ThemedText";
import { FlatList, SafeAreaView, View } from "react-native";
import { useAuth } from "../../scripts/AuthContext";
import { Surface, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import {BarChart} from 'react-native-gifted-charts'
import { useCallback, useLayoutEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, Button } from "react-native";
import { ThemedView } from "../../components/ThemedView";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';



export default function RepeatingTaskInput () {
    const { user, token } = useAuth()

    const [taskName, setTaskName] = useState('');
    const [dueDatetime, setDueDatetime] = useState(new Date ());
    const [frequencyWeeks, setFrequencyWeeks] = useState(0);
    const [frequencyDays, setFrequencyDays] = useState(0);
    const [frequencyHours, setFrequencyHours] = useState(0);
    const [frequencyMinutes, setFrequencyMinutes] = useState(0);
    const [memo, setMemo] = useState(null);
    const [highPriority, setHighPriority] = useState(null);
    const [count, setCount] = useState(0);
    
    // // Update logDatetime every second
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //     setLogDatetime(new Date());
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);
    
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
            name: taskName,
            first_due: dueDatetime.toISOString(),
            frequency_weeks: parseInt(frequencyWeeks),
            frequency_days: parseInt(frequencyDays),
            frequency_hours: parseInt(frequencyHours),
            frequency_minutes: parseInt(frequencyMinutes),
            memo: '',
            high_priority: highPriority
        };
    
        console.log('Payload:', payload);
        console.log('JWT token:', token);

    
        try {
        const response = await fetch('https://react-tasks-online.onrender.com/api/repeating-tasks', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    
        const data = await response.json();
        console.log('Task log response:', data);
    
        if (data.msg === 'Task created') {
            setTaskName('');
            setDueDatetime(new Date());
        }
        } catch (error) {
         console.error('Error submitting task:', error);
        }
    };

    const [open, setOpen] = useState(false);


    const [items, setItems] = useState([
        { label: 'High', value: true },
        { label: 'Normal', value: false }
    ]);

    return(
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80} // adjust if header overlaps inputs
        >
            {/* <ScrollView
                contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                keyboardShouldPersistTaps="handled"
            >
                 */}
                <View >
                    <Text style={styles.label}>Task Name</Text>
                    <TextInput
                        value={taskName}
                        onChangeText={setTaskName}
                        placeholder="Enter task name"
                        style={styles.input}
                        mode='outlined'
                    />

                    <ThemedText style={styles.label}>First Due</ThemedText>
                    <Surface style={{ padding: 10, marginVertical: 5 }}>
                        <ThemedText>
                            {dueDatetime ? dueDatetime.toLocaleString() : "Pick a date"}
                        </ThemedText>
                    </Surface>
                    <ThemedView style={styles.buttonsDatetime}>
                        <Button color={'#000080'} onPress={showDatePicker} title="Pick Date" />
                        <Button color={'#000080'} onPress={showTimePicker} title="Pick Time" />
                    </ThemedView>
                        <ThemedText style={styles.frequencyTitle}>
                            Frequency
                        </ThemedText>
                        {/* <ThemedText style={styles.frequencySubtitle}>
                            (How often?)
                        </ThemedText> */}
                    <ThemedView style={styles.frequencyInputContainer}>
                        <ThemedView>
                            <ThemedText>
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
                        </ThemedView>
                        <ThemedView>
                            <ThemedText>
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
                        </ThemedView>
                        <ThemedView>
                            <ThemedText>
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
                        </ThemedView>
                        <ThemedView>
                            <ThemedText>
                                Hours
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
                        </ThemedView>



                    </ThemedView>

                    
                    <ThemedView>
                        <ThemedText style={styles.label}>Priority</ThemedText>

                        <DropDownPicker
                            open={open}
                            value={highPriority}
                            items={items}
                            setOpen={setOpen}
                            setValue={setHighPriority}
                            setItems={setItems}
                            placeholder="Select an option"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                    </ThemedView>
                
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Button title="-" onPress={() => setCount(count - 1)} />
                        <Text style={{ marginHorizontal: 10 }}>{count}</Text>
                        <Button title="+" onPress={() => setCount(count + 1)} />
                    </View>

                    <ThemedView style={styles.buttonsForm}>
                        <Button color={'#000080'} style={styles.button} onPress={handleSubmit} title="Submit" />
                        <Button color={'#000080'} style={styles.button} onPress={setDueDateNow} title="Set Due to Now" />
                
                    </ThemedView>
            
                </View>
            {/* </ScrollView> */}
        </KeyboardAvoidingView>

    )    
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    
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
    gap: 48,
    backgroundColor: 'rgba(0,0,0,0)'

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
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center'
  },
  input: {
    marginBottom: 12,
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

  },
  frequencyTitleContainer: {
    margin: 'auto',
  },
  frequencyTitle: {
    fontSize:18,
    padding: 16,
    textAlign:'center'
  }
});
