

import React from "react";
import { View, Text, StyleSheet, Pressable, Image, TextInput, SafeAreaView, ActivityIndicator, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Home_image from '../assets/42_logo.png';
import { user_id, user_secret } from "../config.json";
import Image_background from "../assets/42.jpeg"

const Home = ({ navigation }) => {
    const [login, onChangeLogin] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const getToken = async () => {
        try {
            const token = await axios.post("https://api.intra.42.fr/oauth/token/", {
                client_id: user_id,
                client_secret: user_secret,
                grant_type: "client_credentials",
            });

            if (token.data) {
                return token.data;
            }
        } catch (error) {
            return null;
        }
    };

    const sendRequ = async (login, token) => {
        try {
            var response = await axios.get(
                "https://api.intra.42.fr/v2/users/" + (login.trim()).toLowerCase(),
                {
                    headers: {
                        Authorization: "Bearer " + token.access_token,
                    },
                }
            );
            if (response.data) {
                var coalition = await axios.get(
                    "https://api.intra.42.fr/v2/users/" + response.data.id + "/coalitions",
                    {
                        headers: {
                            Authorization: "Bearer " + token.access_token,
                        },
                    }
                )
                if (coalition.data) {
                    setLoading(false);
                    navigation.navigate("Details", { data: response.data, coalition: coalition.data });
                }
            }
        } catch (error) {
            console.log(error.message);
            alert("login doesnt exist");
            setLoading(false)
        }
    };

    const fetchLogin = async (login) => {
        setLoading(true);
        login.trim();
        if (login && login !== "") {
            try {
                var token = await AsyncStorage.getItem("access_token");
                console.log(token);
                
                if (token) {

                    token = JSON.parse(token);
                    if ((token.created_at + token.expires_in) <= (Date.now() / 1000)) {
                        console.log("token expired");
                        token = await getToken();
                        if (token)
                            await AsyncStorage.setItem("access_token", JSON.stringify(token));
                    }
                }
                else {
                    token = await getToken();
                    if (token)
                        await AsyncStorage.setItem("access_token", JSON.stringify(token));
                }
                await sendRequ(login, token);
            }
            catch (error) {
                console.log(error);
                alert(error);
                setLoading(false);
            }

        }
        else
            alert("you should set a login first");
        setLoading(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={Image_background}
                resizeMode="cover"
                style={{ flex: 1, height: "100%", width: "100%", display: "flex", justifyContent: "center" }}
            >
                {!loading ?
                    <View style={styles.viewContainer}>
                        <Image style={styles.tinyLogo} source={Home_image} resizeMode="cover" />
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeLogin}
                            value={login}
                            placeholder="Login"
                        />
                        <Pressable
                            style={styles.button}
                            onPress={() => fetchLogin(login)}
                        >
                            <Text style={styles.text}>Search</Text>
                        </Pressable>
                    </View>
                    : <ActivityIndicator size="large" color="#00b0b2" />}
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    viewContainer: {
        marginTop: -100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tinyLogo: {
        width: 150,
        height: 150,
        maxWidth: 200,
        maxHeight: 200,
        marginLeft: -20,
    },
    input: {
        width: '80%',
        margin: 12,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#00b0b2",
        backgroundColor: "white",
        padding: 10,
    },
    button: {
        backgroundColor: "#00b0b2",
        width: '80%',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 17,

    },
});

export default Home;