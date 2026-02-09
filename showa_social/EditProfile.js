import React, {useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {View, Text, Image, TouchableOpacity, StyleSheet} from "react-native";
import {API_ROUTE, API_ROUTE_IMAGE} from "../api_routing/api";


const UserProfile = ({navigation, route}) => {
  const {user_ID} = route.params;

  const [userData, setUserData] = useState([]);
  const [userProfileImage, setUserProfileImage] = useState("");

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(`${API_ROUTE}/user/${user_ID}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setUserData(response.data);
        const baseURL = `${API_ROUTE_IMAGE}`;
        const profilePicture = response.data.profile_picture
          ? `${baseURL}${response.data.profile_picture}`
          : null;
        setUserProfileImage(profilePicture);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigation.navigate("LoginScreen");
      }
      setUserProfileImage(null);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={{uri: userProfileImage}} style={styles.profileImage} />
      <Text style={styles.username}>{userData.username}</Text>
      <TouchableOpacity onPress={() => navigation.navigate("EditProfile", {user_ID})}>
        <Text style={styles.editButton}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  editButton: {
    color: "#007BFF",
    fontSize: 16,
  },
});


export default UserProfile;

