import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Slider,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SettingsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedAge, setSelectedAge] = useState("25-34");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="chevron-back" size={24} color="#FF5A7E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Bio metrics Log In</Text>
          <Switch
            trackColor={{ false: "#ccc", true: "#FFB6C1" }}
            thumbColor={isEnabled ? "#FF5A7E" : "#f4f3f4"}
            value={isEnabled}
            onValueChange={() => setIsEnabled(!isEnabled)}
          />
        </View>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.label}>Change Password</Text>
          <Icon name="chevron-forward" size={18} color="#FF5A7E" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.label}>Change Phone Number</Text>
          <Icon name="chevron-forward" size={18} color="#FF5A7E" />
        </TouchableOpacity>

        <Text style={styles.subTitle}>I want to see</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.label}>Men</Text>
          <Icon name="chevron-forward" size={18} color="#FF5A7E" />
        </TouchableOpacity>

        <Text style={styles.subTitle}>
          Choose the Age Range You'd Like to Match With
        </Text>

        <View style={styles.ageButtons}>
          {["18-24", "25-34", "35-44", "45+"].map((age) => (
            <TouchableOpacity
              key={age}
              style={[
                styles.ageButton,
                selectedAge === age && styles.ageSelected,
              ]}
              onPress={() => setSelectedAge(age)}
            >
              <Text
                style={[
                  styles.ageText,
                  selectedAge === age && { color: "#fff" },
                ]}
              >
                {age}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.subTitle, { marginTop: 20 }]}>Distance Limit</Text>
        <Text style={styles.distance}>5 km / 3 miles</Text>

        <TouchableOpacity style={styles.option}>
          <Text style={[styles.label, { color: "#FF5A7E" }]}>Log out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.label}>Privacy policy</Text>
          <Icon name="chevron-forward" size={18} color="#FF5A7E" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#FF5A7E" },
  section: { paddingHorizontal: 20 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  label: { fontSize: 15, color: "#333" },
  subTitle: {
    marginTop: 20,
    color: "#777",
    fontSize: 13,
    marginBottom: 5,
  },
  ageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  ageButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF5A7E",
  },
  ageSelected: { backgroundColor: "#FF5A7E" },
  ageText: { color: "#FF5A7E", fontSize: 13, fontWeight: "500" },
  distance: { color: "#FF5A7E", marginVertical: 10 },
});
