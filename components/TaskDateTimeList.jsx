import React, { useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollableDataTable } from "./DataListWrapper";

export default function TaskDateTimeList({ token, taskRecords, setTaskRecords }) {
    const [markedDates, setMarkedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const columns = [
        {key: 'name', title: 'Task Name'},
        {key: 'due_datetime', title: 'Due DateTime'},
        {key: 'log_datetime', title: 'Log DateTime'},
        {key: 'fin_datetime', title: 'Finish DateTime'},
    ]


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
      <ScrollableDataTable
        data={taskRecords}
        columns={columns}

      />
    </View>
  );
}
