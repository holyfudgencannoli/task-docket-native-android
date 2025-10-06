import { ThemedText } from "../../components/ThemedText";
import { FlatList, SafeAreaView, View } from "react-native";
import { useAuth } from "../../scripts/AuthContext";
import { Surface } from "react-native-paper";
import { StyleSheet, Button } from "react-native";
import {BarChart} from 'react-native-gifted-charts'
import { useCallback, useLayoutEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import RepeatingoDoListNative from "../../components/RepeatingToDoList";



export default function () {
    const { user, token } = useAuth()

    return(
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80} // adjust if header overlaps inputs
        >
                <View style={{ flexGrow: 1, padding: 20 }}>
                    <ThemedText style={styles.title}>Repeating Tasks Records</ThemedText>
                    <RepeatingoDoListNative />
                </View>
        </KeyboardAvoidingView>
    )    
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: {
    fontSize: 16
  },

  button:{
    color: 'black'
  },
  reactLogo: {
    height: 360,
    width: 420,
    bottom: 0,
    left: -10,
    position: 'absolute',
    alignItems: 'center'
  },
  listTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 28,
    padding: 36,

    
  },
  list: {
    // padding:32
  },
  listItem: {
    fontSize: 24,

    margin: 8
  },
  taskRow: {
    backgroundColor: '#fff',
    flexDirection: 'cloumn',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  }
});
