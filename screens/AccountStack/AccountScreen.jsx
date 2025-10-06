import LogoutButton from "../../components/LogoutButton";
import { ThemedText } from "../../components/ThemedText";
import { useAuth } from "../../scripts/AuthContext";
import { StyleSheet } from "react-native";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { Image } from "expo-image";

export default function AccountScreen() {
    const { user, token } = useAuth()
    

    return(
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedText style={styles.greeting}>
                Hello {user ? user.username : "User"}!
            </ThemedText>

            <LogoutButton/>
        
        </ParallaxScrollView>
    )
    
}

const styles = StyleSheet.create({
    greeting: {
        fontSize:21,
        padding:24,
        textAlign:'center'
    },
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

