import React, {useEffect} from "react";
import {
  StyleSheet,
  ImageBackground,
  Image,
  View,
  Text,
  Pressable,
} from "react-native";
import { useNavigate } from "react-router-native";
import {useAuthRequest} from "expo-auth-session";

const Login = ({ navigation }) => {
  
  
  // Endpoint
  const discovery = {
    authorizationEndpoint: "https://api.intra.42.fr/oauth/authorize",
    tokenEndpoint: "https://api.intra.42.fr/oauth/token",
  };
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId:
        "u-s4t2ud-102501d9bc4fb851566d0a04bc0ab63242b1cd093211debf29a2528ea8e3e87f",
      redirectUri: "exp://localhost:19000",
    },
    discovery,
  );

  useEffect(() => {
  
    if (response?.type == "success") navigation.navigate("Home");
    
  }, [response]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/42.jpeg")}
        resizeMode="cover"
        style={styles.image}
      >
        <Image source={require("../assets/42_logo.png")} style={styles.logo} />
        <Pressable
          style={styles.button}
          title="Go to Details... again"
          onPress={() => {
            promptAsync();
          }}
        >
          <Text style={styles.text}>Login</Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    margin: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
export default Login;
