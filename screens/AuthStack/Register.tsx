import ParallaxScrollView from '../../components/ParallaxScrollView';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Button, StyleSheet,SafeAreaView } from 'react-native';
import { Surface, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from '../../components/ThemedText';

export default function RegisterScreen() {
    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [isAdmin, setIsAdmin] = useState('')
    const [message, setMessage] = useState("");


    const handleRegister = async () => {
        setMessage("");

        const formData = new FormData();
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("is_admin", String(isAdmin));

        try {
            const response = await fetch("https://react-tasks-online.onrender.com/api/auth/register", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data: { msg: string } = await response.json();

            if (response.ok) {
                setMessage("✅ " + data.msg);
                setUsername("");
                setPassword("");
                navigation.navigate("Login"); // ✅ React Navigation way
            } else {
                setMessage("❌ " + data.msg);
            }
        } catch (err) {
        console.error(err);
        setMessage("⚠️ Server error, try again later.");
        }
    };

    return(
        <SafeAreaView style={styles.container}>
        
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
                            source={require('../../assets/inline-logo.png')}
                            style={styles.reactLogo}
                        />
                    }
                >
                    <Surface style={{ padding: 16 }}>
                        <ThemedText style={styles.formHeader}>
                            User Registration
                        </ThemedText>
                        <TextInput
                            style={{ marginTop: 16, marginBottom: 12 }}
                            value={username}
                            onChangeText={setUsername}
                            mode='outlined'
                            label="Username"
                            autoCapitalize='none'
                            autoComplete='username-new'
                        />
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            mode="outlined"
                            secureTextEntry={!showPassword}  // hides text if false
                            textContentType='password'
                            autoComplete='password-new'
                            right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                            }
                            style={{ marginTop: 16, marginBottom: 12 }}
                        />
                        <TextInput
                            label="Confirrm Password"
                            value={passwordConfirm}
                            onChangeText={setPasswordConfirm}
                            mode="outlined"
                            autoComplete='password-new'
                            secureTextEntry={!showPasswordConfirm}  // hides text if false
                            right={
                            <TextInput.Icon
                                icon={showPasswordConfirm ? "eye-off" : "eye"}
                                onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                            />
                            }
                            style={{ marginTop: 16, marginBottom: 12 }}
                        />
                        <TextInput
                            label="Email"
                            keyboardType='email-address'
                            value={email}
                            onChangeText={setEmail}
                            mode='outlined'
                            style={{ marginTop: 16, marginBottom: 12 }}
                        />
                        <TextInput
                            label="Phone Number"
                            keyboardType='phone-pad'
                            value={phone}
                            onChangeText={setPhone}
                            mode='outlined'
                            style={{ marginTop: 16, marginBottom: 12 }}
                        />
                        <Button title='Submit' onPress={handleRegister} />
                    </Surface>
            
                </ParallaxScrollView>

                
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )


}

const styles = StyleSheet.create({
    formHeader:{
        textAlign: 'center',
        fontSize: 24,
        padding: 16,
        fontWeight:'bold',
        color:  '#33aa33',
    },
    titleContainer: {
        flexDirection: 'row',
        margin: 'auto',
        gap: 8,
    },
    inputContainer: {
        backgroundColor: 'black',
        color: 'white'
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
        reactLogo: {
            height: 120,
            width: 420,
            bottom: -6,
            left: -6,
            position: 'absolute',
            alignItems: 'center'
        },
    container: {
        flex: 1,
        // padding: 16,
        backgroundColor: '#fff',
    },

});