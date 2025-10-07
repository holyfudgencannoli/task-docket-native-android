import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View } from 'react-native';
import { Surface, TextInput } from 'react-native-paper';
import * as React from "react";
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../scripts/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import notifee from '@notifee/react-native';

export default function Login() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const { login } = useAuth();

    
    async function requestPermission() {
        const settings = await notifee.requestPermission();

        if (settings.authorizationStatus >= 1) {
            console.log('Permission granted!');
        } else {
            console.log('Permission denied!');
        }
    }

    

    React.useEffect(() => {
        requestPermission()
    }, [])

    const navigation = useNavigation()

    const handleLogin = async () => {

        try {
            const res = await fetch("https://react-tasks-online.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                const token = data.access_token;
                const user = data.user;
                login(user, token)
                navigation.navigate("Root");
            } else {
                alert(data.msg || "Login failed");
            }
        } catch (err) {
            console.error("Error caught in handleLogin:", {
                name: err?.name,
                message: err?.message,
                stack: err?.stack,
                full: JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
            });

            alert(`Server error: ${err?.message || "Unknown error"}`);
        }
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 0 }}
            enableOnAndroid={true}
            extraScrollHeight={180}
            keyboardOpeningTime={0}
            enableAutomaticScroll={true}
            keyboardShouldPersistTaps="handled"
        >
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
                headerImage={
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.reactLogo}
                    />
                }
            >
                <Surface style={{ padding: 16 }}>
                    <TextInput
                        style={{ marginTop: 16}}
                        label="Username"
                        value={username}
                        mode='outlined'
                        onChangeText={setUsername}
                        autoCapitalize='none'
                        autoComplete='username'
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        autoCapitalize='none'
                        autoComplete='password'
                        secureTextEntry={!showPassword}  // hides text if false
                        right={
                        <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                        }
                        style={{ marginTop: 16, marginBottom: 12 }}
                    />
                    {/* <Button onPress={() => navigation.navigate("Root")} color="#000080" style={styles.button} title='Log In'></Button> */}
                    <Button onPress={handleLogin} color="#000080" style={styles.button} title='Log In'></Button>
                </Surface>
                <View style={{ display:'flex', flexDirection: 'row', margin: 'auto', gap: 48 }}>
                    <Button color="#000080" onPress={() => navigation.navigate('RegisterScreen')} title='Create Account'></Button>
                    <Button color="#000080" title='Forgot Password' onPress={() => navigation.navigate('PasswordRecoveryScreen')}></Button>
                </View>
            </ParallaxScrollView>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    color: 'black'
  },
  reactLogo: {
    height: 180,
    width: 420,
    bottom: -10,
    left: -10,
    position: 'absolute',
    alignItems: 'center'
  },
});
