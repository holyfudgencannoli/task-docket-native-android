import { useAuth } from "../scripts/AuthContext";
import { Button } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";

export default function LogoutButton() {
    const navigation = useNavigation();
    const { token, logout } = useAuth();

    const handleLogout = async () => {
        if (!token) return;
        

        try {
            const res = await fetch("https://react-tasks-online.onrender.com/api/auth/logout", {
                method: "POST",
                headers : {
                    Authorization: `Bearer ${token}`
                },                
                credentials: "include"
            });
            if (!res.ok) throw new Error("Logout failed");
            
            logout()
            navigation.dispatch(
                CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }], // replace with your login screen name
                })
            );
        } catch (err) {
            console.error(err);
            alert("Error logging out");
        }
    };

    return (
        
        <Button id="logout-button" onPress={handleLogout} title="Logout" />
    );
}
