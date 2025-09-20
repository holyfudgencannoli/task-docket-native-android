import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Button } from "react-native";
import { Text } from "react-native-paper";
import { ThemedText } from "./ThemedText";

export default function () {
    const [date, setDate] = useState(new Date())

    const onChange = (event, selectedDate) => {
        const currentDate= selectedDate;
        setDate(currentDate)
    }

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: false
        });
    };

    const showDatePicker = () => {
        showMode('date')   
    }    
    const showTimePicker = () => {
        showMode('time')   
    }    

    return(
        <>
            <ThemedText>selected: {date.toLocaleString()}</ThemedText>
            <Button onPress={showDatePicker} title=" Show date picker" />
            <Button onPress={showTimePicker} title="Show time picker" />
        </>
    )
    
}