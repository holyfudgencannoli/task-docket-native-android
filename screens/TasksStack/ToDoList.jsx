import { ThemedText } from "../../components/ThemedText"
import ToDoListTable from "../../components/ToDoListTable"
import { StyleSheet } from "react-native"

export default function ToDoList() {
    return (
        <>
            <ThemedText style={styles.title}>To Do List</ThemedText>
            <ToDoListTable />
        </>
    )
}



const styles = StyleSheet.create({
    title: {
        fontSize:36,
        padding:24,
        textAlign:'center'
    }
})
