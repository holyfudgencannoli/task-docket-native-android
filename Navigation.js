import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { Image  } from 'expo-image';
import { StyleSheet } from 'react-native';
import { ThemedView } from './components/ThemedView';
import ParallaxScrollView from './components/ParallaxScrollView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';

import Login from './screens/AuthStack/Login';
import PasswordRecoveryScreen from './screens/AuthStack/PasswordRecovery';
import RegisterScreen from './screens/AuthStack/Register';
import AccountScreen from './screens/AccountStack/AccountScreen';
import Dashboard from './screens/HomeStack/Dashboard';
import TaskInput from './screens/HomeStack/TaskInput';
import TaskRecords from './screens/TasksStack/TaskRecords';
import ToDoList from './screens/TasksStack/ToDoList';
import RepeatingTaskRecords from './screens/TasksStack/RepeatingTaskRecords';
import RepeatingTaskInput from './screens/HomeStack/RepeatingTaskInput';



const AuthStack = createNativeStackNavigator();

function AuthStackGroup() {
    return(
        <AuthStack.Navigator>
            <AuthStack.Screen component={Login} name='Login' options={{ headerShown: false }}/>
            <AuthStack.Screen component={RegisterScreen} name='RegisterScreen' options={{ headerShown: false }}/>
            <AuthStack.Screen component={PasswordRecoveryScreen} name='PasswordRecoveryScreen' />
            <AuthStack.Screen component={RootBottomTabGroup} name='Root' options={{ headerShown: false }} />
        </AuthStack.Navigator>
    )
    
}

export default function Navigation() {
    return(
        <NavigationContainer>
            <AuthStackGroup />
        </NavigationContainer>
    )
}


const RootBottomTabs = createBottomTabNavigator();

function RootBottomTabGroup() {
    return(
        <RootBottomTabs.Navigator
            screenOptions={({route}) => ({
                tabBarIcon:({ focused, color, size }) =>{
                    let iconName;

                    if (route.name === 'Home'){
                        iconName = focused ? 'home' : 'home-outline' ;
                    } else if (route.name === 'Tasks'){
                        iconName = focused ? 'list-circle' : 'list-circle-outline' ;
                    } else if (route.name === 'Account'){
                        iconName = focused ? 'person' : 'person-outline' ;
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <RootBottomTabs.Screen component={HomeStackGroup} name='Home' options={{ headerShown: false }}/>
            <RootBottomTabs.Screen component={TaskStackGroup} name='Tasks' options={{ headerShown: false }}/>
            <RootBottomTabs.Screen component={AccountStackGroup} name='Account' options={{ headerShown: false }}/>
        </RootBottomTabs.Navigator>
    )
    
}

const HomeNav = createMaterialTopTabNavigator()

function HomeNavGroup() {
    return(
            <HomeNav.Navigator>
                <HomeNav.Screen component={Dashboard} name='Dashboard' />
                <HomeNav.Screen component={TaskInput} name='New Task' />
                <HomeNav.Screen component={RepeatingTaskInput} name='New Repeating Task' />

            </HomeNav.Navigator>
    )
}


function HomeWithHeader() {
  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header image above tabs */}
      <Image
        source={require('./assets/inline-logo.png')}
        style={{ width: '100%', height: 120, position: 'relative', top: 24, backgroundColor: '#A1CEDC' }}
        resizeMode="cover"
      />

      {/* Tabs below image */}
      <HomeNavGroup />
    </ThemedView>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeStackGroup() {
    return(
        <HomeStack.Navigator>
            <HomeStack.Screen component={HomeWithHeader} name='HomeNav' options={{ headerShown: false }} />
        </HomeStack.Navigator>        
    )
}

const TaskNav = createMaterialTopTabNavigator()

function TaskNavGroup() {
    return(
        <TaskNav.Navigator initialRouteName={'Repeating Task List'}>
            <TaskNav.Screen  component={RepeatingTaskRecords} name='Repeating Task List' />
            <TaskNav.Screen  component={TaskRecords} name='Task Calendar' />
            <TaskNav.Screen  component={ToDoList} name='To Do List' />
        </TaskNav.Navigator>
    )
}


function TasksWithHeader() {
  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header image above tabs */}
      <Image
        source={require('./assets/inline-logo.png')}
        style={{ width: '100%', height: 120, position: 'relative', top: 24, backgroundColor: '#A1CEDC' }}
        resizeMode="cover"
      />

      {/* Tabs below image */}
      <TaskNavGroup />
    </ThemedView>
  );
}

const TaskStack = createNativeStackNavigator();

function TaskStackGroup() {
    return(
        <TaskStack.Navigator>
            <TaskStack.Screen component={TasksWithHeader} name='TaskNav' options={{ headerShown: false }} />
        </TaskStack.Navigator>        
    )
}

const AccountStack = createNativeStackNavigator();

function AccountStackGroup() {
    return(
        <AccountStack.Navigator>
            <AccountStack.Screen component={AccountScreen} name='AccountNav' options={{ headerShown: false }} />
        </AccountStack.Navigator>
    )
}