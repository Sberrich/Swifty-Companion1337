import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  Image,
  View,
  Text,
  TextInput,
  Pressable,
} from "react-native";
import { MainLoader } from "react-native-preloader-shimmer";

const Home = ({ navigation }) => {
  const [LoginUser, setLoginUser] = useState("");

  const getUser = () => {};

  return (
    <View style={styles.container}>

     
      <ImageBackground
        source={require("../assets/Home.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <Image
          source={require("../assets/um6p_1337.png")}
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          onChangeText={setLoginUser}
          placeholderTextColor="#98BAE7"
          placeholder="Login"
          value={LoginUser}
        />
        <Pressable style={styles.button} title="search" onPress={getUser}>
          <Text style={styles.text}> Search</Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "start",
    justifyContent: "center",
    display: "flex",
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "start",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 150,
    margin: 20,
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
  input: {
    height: 50,
    margin: 20,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 4,
  },
});
export default Home;
