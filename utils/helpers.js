import axios from "axios";
const client_id =
    "u-s4t2ud-102501d9bc4fb851566d0a04bc0ab63242b1cd093211debf29a2528ea8e3e87f";
const client_secret =
    "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";

const url = "https://api.intra.42.fr/v2/users/";

import AsyncStorage from "@react-native-async-storage/async-storage";

const storeDataToStorage = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem("accessToken", jsonValue);
    } catch (e) {
        // saving error
    }
};

const getDataFromStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem("accessToken");
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e);
    }
};

export const getNewAccessToken = () => {
    return new Promise((resolve, reject) => {
        axios
            .post("https://api.intra.42.fr/oauth/token", {
                grant_type: "client_credentials",
                client_id,
                client_secret,
            })
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    });
};

export const getAccessToken = () => {
    return new Promise(async (resolve, reject) => {
        const data = await getDataFromStorage();
        if (data) {
            {
                const diffTime =
                    data.created_at + data.expires_in - Date.now() / 1000;
                if (diffTime > 0) resolve(data);
                else
                    getNewAccessToken()
                        .then((res) => {
                            storeDataToStorage(res);
                            resolve(res);
                        })
                        .catch((err) => reject(err));
            }
        } else {
            getNewAccessToken()
                .then((res) => {
                    storeDataToStorage(res);
                    resolve(res);
                })
                .catch((err) => reject(err));
        }
    });
};

const parseData = ({ user, coalition }) => {
    const {
        login,
        correction_point,
        location,
        image_url,
        wallet,
        projects_users,
        cursus_users,
    } = user;

    let data = [];
    let elem = coalition.length;
    cursus_users.reverse().forEach((cursus, index) => {
        const {
            skills,
            grade,
            level,
            cursus: { name, id },
        } = cursus;
        let coalitionData;
        if (elem > 0 && grade != null) {
            coalitionData = {
                hascoalition: true,
                image_url: coalition[coalition.length - elem].image_url,
                name: coalition[coalition.length - elem].name,
                color: coalition[coalition.length - elem].color,
                score: coalition[coalition.length - elem].score,
            };
            elem--;
        } else {
            coalitionData = {
                hascoalition: false,
            };
        }
        let projects = projects_users?.filter((project) =>
            project.cursus_ids.find((element) => element === id)
        );
        data.push({
            name,
            level,
            grade,
            skills,
            id,
            coalition: coalitionData,
            projects,
        });
    });
    return {
        login,
        correction_point,
        location,
        image_url,
        wallet,
        cursus: data,
    };
};

export const getUserData = (login) => {
    return new Promise((resolve, reject) => {
        getAccessToken().then((res) => {
            const token = res.access_token;
            axios
                .get(`${url}${login.toLowerCase()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    const userData = res.data;
                    axios
                        .get(`${url}${res.data.id}/coalitions`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        .then((res) => {
                            // console.log(res);
                            result = parseData({
                                user: userData,
                                coalition: res.data,
                            });
                            resolve(result);
                        })
                        .catch((err) => reject(err.response));
                })
                .catch((err) => reject(err));
        });
    });
};
