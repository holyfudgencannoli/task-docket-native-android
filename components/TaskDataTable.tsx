import * as React from 'react';
import { DataTable } from 'react-native-paper';
import { useAuth } from '../scripts/AuthContext';
import { useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import TaskDatePicker from './DatePickerRecords';
import { ScrollView, View } from 'react-native';

const TaskDataTable = () => {
    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        numberOfItemsPerPageList[0]
    );
    const { user, token, logout } = useAuth();

    let [taskRecords, setTaskRecords] = React.useState([])
    let [date, setDate] = React.useState(new Date())


    async function getDaysTasks() {
        let isoString = date.toISOString().slice(0, 10);
        try {
            let res = await fetch('https://react-tasks-online.onrender.com/api/get-tasks', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({'date': isoString})
            });

            let data = await res.json();
            console.log(data)

            if (!data.tasks || data.tasks.length === 0) {
                console.log("No tasks found!");
                setTaskRecords([])
            } else {
                setTaskRecords(data.tasks);
            }

        } catch (err) {
             console.error("Error caught in getDaysTasks", {
                name: err?.name,
                message: err?.message,
                stack: err?.stack,
                full: JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
            });

            alert(`Server error: ${err?.message || "Unknown error"}`);
        }
    };

    let formattedDate = (date) => {
        let fd = new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        return fd
    };

    let formattedTime = (date) =>{
        let ft = new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        })
        return ft
    };
    
    
    let fetchTasks = async () => {
        let isoString = date.toISOString().slice(0, 10);
        try {
            let res = await fetch('https://react-tasks-online.onrender.com/api/get-tasks', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({'date': isoString})
            });

            let data = await res.json();
            console.log(data)

            if (!data.tasks || data.tasks.length === 0) {
                console.log("No tasks found!");
            } else {
                setTaskRecords(data.tasks);
            }

        } catch (err) {
            console.error("Error caught in layout:fetchTasks", {
                name: err?.name,
                message: err?.message,
                stack: err?.stack,
                full: JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
            });
        }
    }
    useLayoutEffect(() => {
        fetchTasks();
    }, [date]);


    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [])
    );

    
    const items = taskRecords.map((task) => ({
        id: task.id,
        name: task.name,
        
        completionTime: task.fin_datetime ? new Date(task.fin_datetime).toLocaleString("en-GB", {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }) : 'Not completed yet',
    }))
    

  return (
    <>
        <TaskDatePicker token={token} setTaskRecords={setTaskRecords}/>
        <View style={{ flex: 1, marginTop: 60 }}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Task Name</DataTable.Title>
                    <DataTable.Title>Completion</DataTable.Title>
                </DataTable.Header>
                <ScrollView>
                    {items.map((item) => (
                        <DataTable.Row key={item.id}>
                        <DataTable.Cell>{item.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.completionTime}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </ScrollView>

                
            </DataTable>
        </View>
        
    </>
  );
};

export default TaskDataTable;