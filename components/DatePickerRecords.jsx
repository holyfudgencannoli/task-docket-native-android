import React, { useState } from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";

export default function TaskCalendar({ token, setTaskRecords }) {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch all task dates from backend
  const fetchTaskDates = async () => {
    try {
      let res = await fetch("https://react-tasks-online.onrender.com/api/get-task-dates", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let data = await res.json();
      console.log("Fetched dates:", data.dates);

      if (data.dates) {
        let marks = {};
        data.dates.forEach((d) => {
          marks[d] = { marked: true, dotColor: "blue" };
        });
        setMarkedDates(marks);
      }
    } catch (err) {
      console.error("Error fetching task dates", err);
    }
  };

  // Fetch tasks for the selected day
  const fetchTasksForDay = async (dayString) => {
    try {
      let res = await fetch("https://react-tasks-online.onrender.com/api/get-tasks", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: dayString }),
      });

      let data = await res.json();
      console.log("Fetched tasks for", dayString, data.tasks);
      setTaskRecords(data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks for day", err);
    }
  };

  // Trigger fetching when screen focused
  useFocusEffect(
    React.useCallback(() => {
      fetchTaskDates();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  selectedColor: "green",
                  marked: true,
                  dotColor: "blue",
                },
              }
            : {}),
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString); // YYYY-MM-DD
          fetchTasksForDay(day.dateString);
        }}
      />
    </View>
  );
}
