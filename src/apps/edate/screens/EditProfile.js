// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Switch,
//   ScrollView,
//   Slider,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

// const SettingsScreen = () => {
//   const [isEnabled, setIsEnabled] = useState(false);
//   const [selectedAge, setSelectedAge] = useState("25-34");

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <View style={styles.header}>
//         <TouchableOpacity>
//           <Icon name="chevron-back" size={24} color="#FF5A7E" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Settings</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <View style={styles.section}>
//         <View style={styles.rowBetween}>
//           <Text style={styles.label}>Bio metrics Log In</Text>
//           <Switch
//             trackColor={{ false: "#ccc", true: "#FFB6C1" }}
//             thumbColor={isEnabled ? "#FF5A7E" : "#f4f3f4"}
//             value={isEnabled}
//             onValueChange={() => setIsEnabled(!isEnabled)}
//           />
//         </View>

//         <TouchableOpacity style={styles.option}>
//           <Text style={styles.label}>Change Password</Text>
//           <Icon name="chevron-forward" size={18} color="#FF5A7E" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.option}>
//           <Text style={styles.label}>Change Phone Number</Text>
//           <Icon name="chevron-forward" size={18} color="#FF5A7E" />
//         </TouchableOpacity>

//         <Text style={styles.subTitle}>I want to see</Text>
//         <TouchableOpacity style={styles.option}>
//           <Text style={styles.label}>Men</Text>
//           <Icon name="chevron-forward" size={18} color="#FF5A7E" />
//         </TouchableOpacity>

//         <Text style={styles.subTitle}>
//           Choose the Age Range You'd Like to Match With
//         </Text>

//         <View style={styles.ageButtons}>
//           {["18-24", "25-34", "35-44", "45+"].map((age) => (
//             <TouchableOpacity
//               key={age}
//               style={[
//                 styles.ageButton,
//                 selectedAge === age && styles.ageSelected,
//               ]}
//               onPress={() => setSelectedAge(age)}
//             >
//               <Text
//                 style={[
//                   styles.ageText,
//                   selectedAge === age && { color: "#fff" },
//                 ]}
//               >
//                 {age}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text style={[styles.subTitle, { marginTop: 20 }]}>Distance Limit</Text>
//         <Text style={styles.distance}>5 km / 3 miles</Text>

//         <TouchableOpacity style={styles.option}>
//           <Text style={[styles.label, { color: "#FF5A7E" }]}>Log out</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.option}>
//           <Text style={styles.label}>Privacy policy</Text>
//           <Icon name="chevron-forward" size={18} color="#FF5A7E" />
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// export default SettingsScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   headerTitle: { fontSize: 18, fontWeight: "600", color: "#FF5A7E" },
//   section: { paddingHorizontal: 20 },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 15,
//   },
//   option: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f2f2f2",
//   },
//   label: { fontSize: 15, color: "#333" },
//   subTitle: {
//     marginTop: 20,
//     color: "#777",
//     fontSize: 13,
//     marginBottom: 5,
//   },
//   ageButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   ageButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#FF5A7E",
//   },
//   ageSelected: { backgroundColor: "#FF5A7E" },
//   ageText: { color: "#FF5A7E", fontSize: 13, fontWeight: "500" },
//   distance: { color: "#FF5A7E", marginVertical: 10 },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

const SettingsScreen = ({ navigation }) => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [selectedGender, setSelectedGender] = useState("men");
  const [selectedAge, setSelectedAge] = useState("25-34");
  const [selectedDistance, setSelectedDistance] = useState("5");

  const distanceOptions = ["1", "5", "10", "25", "50", "100"];

  const settingsSections = [
    {
      title: "Account & Security",
      icon: "shield-checkmark-outline",
      items: [
        {
          type: "toggle",
          label: "Biometric Login",
          value: biometricsEnabled,
          onValueChange: setBiometricsEnabled,
          icon: "finger-print-outline"
        },
        {
          type: "navigation",
          label: "Change Password",
          icon: "key-outline",
          onPress: () => console.log("Change Password")
        },
        {
          type: "navigation",
          label: "Change Phone Number",
          icon: "call-outline",
          onPress: () => console.log("Change Phone Number")
        },
        {
          type: "navigation",
          label: "Two-Factor Authentication",
          icon: "lock-closed-outline",
          onPress: () => console.log("2FA")
        }
      ]
    },
    {
      title: "Discovery Settings",
      icon: "options-outline",
      items: [
        {
          type: "gender",
          label: "Show Me",
          value: selectedGender,
          onValueChange: setSelectedGender,
          icon: "people-outline"
        },
        {
          type: "age",
          label: "Age Range",
          value: selectedAge,
          onValueChange: setSelectedAge,
          icon: "calendar-outline"
        },
        {
          type: "distance",
          label: "Distance Limit",
          value: selectedDistance,
          onValueChange: setSelectedDistance,
          icon: "location-outline",
          options: distanceOptions
        }
      ]
    },
    {
      title: "Preferences",
      icon: "settings-outline",
      items: [
        {
          type: "toggle",
          label: "Push Notifications",
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
          icon: "notifications-outline"
        },
        {
          type: "toggle",
          label: "Dark Mode",
          value: darkModeEnabled,
          onValueChange: setDarkModeEnabled,
          icon: "moon-outline"
        },
        {
          type: "navigation",
          label: "Language",
          value: "English",
          icon: "language-outline",
          onPress: () => console.log("Language")
        }
      ]
    },
    {
      title: "Support",
      icon: "help-circle-outline",
      items: [
        {
          type: "navigation",
          label: "Privacy Policy",
          icon: "document-text-outline",
          onPress: () => console.log("Privacy Policy")
        },
        {
          type: "navigation",
          label: "Terms of Service",
          icon: "reader-outline",
          onPress: () => console.log("Terms")
        },
        {
          type: "navigation",
          label: "Contact Support",
          icon: "chatbubble-ellipses-outline",
          onPress: () => console.log("Support")
        }
      ]
    }
  ];

  const renderSettingItem = (item) => {
    switch (item.type) {
      case "toggle":
        return (
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name={item.icon} size={20} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: "#E5E5E5", true: "#FF3366" }}
              thumbColor={item.value ? "#FFF" : "#FFF"}
              ios_backgroundColor="#E5E5E5"
            />
          </View>
        );

      case "navigation":
        return (
          <TouchableOpacity style={styles.settingRow} onPress={item.onPress}>
            <View style={styles.settingLeft}>
              <Icon name={item.icon} size={20} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <View style={styles.settingRight}>
              {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
              <Icon name="chevron-forward" size={18} color="#999" />
            </View>
          </TouchableOpacity>
        );

      case "gender":
        return (
          <View style={styles.settingSection}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon name={item.icon} size={20} color="#666" style={styles.settingIcon} />
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
            </View>
            <View style={styles.genderButtons}>
              {["men", "women", "everyone"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    item.value === gender && styles.genderButtonSelected
                  ]}
                  onPress={() => item.onValueChange(gender)}
                >
                  <Text style={[
                    styles.genderButtonText,
                    item.value === gender && styles.genderButtonTextSelected
                  ]}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "age":
        return (
          <View style={styles.settingSection}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon name={item.icon} size={20} color="#666" style={styles.settingIcon} />
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <Text style={styles.ageValue}>{item.value}</Text>
            </View>
            <View style={styles.ageButtons}>
              {["18-24", "25-34", "35-44", "45+"].map((age) => (
                <TouchableOpacity
                  key={age}
                  style={[
                    styles.ageButton,
                    item.value === age && styles.ageButtonSelected
                  ]}
                  onPress={() => item.onValueChange(age)}
                >
                  <Text style={[
                    styles.ageButtonText,
                    item.value === age && styles.ageButtonTextSelected
                  ]}>
                    {age}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "distance":
        return (
          <View style={styles.settingSection}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon name={item.icon} size={20} color="#666" style={styles.settingIcon} />
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <Text style={styles.distanceValue}>{item.value} km</Text>
            </View>
            <View style={styles.distanceButtons}>
              {item.options.map((distance) => (
                <TouchableOpacity
                  key={distance}
                  style={[
                    styles.distanceButton,
                    item.value === distance && styles.distanceButtonSelected
                  ]}
                  onPress={() => item.onValueChange(distance)}
                >
                  <Text style={[
                    styles.distanceButtonText,
                    item.value === distance && styles.distanceButtonTextSelected
                  ]}>
                    {distance} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FF3366" /> */}
      
      {/* Header */}
      <LinearGradient
        colors={['#FF3366', '#FF6F00']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name={section.icon} size={20} color="#FF3366" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Icon name="log-out-outline" size={20} color="#FFF" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>e-Date v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginLeft: 8,
  },
  sectionContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    minHeight: 56,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
    width: 24,
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 14,
    color: "#999",
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 36,
  },
  settingSection: {
    paddingVertical: 8,
  },
  genderButtons: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  genderButtonSelected: {
    backgroundColor: "#FF3366",
    borderColor: "#FF3366",
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  genderButtonTextSelected: {
    color: "#FFF",
  },
  ageValue: {
    fontSize: 14,
    color: "#FF3366",
    fontWeight: "600",
  },
  ageButtons: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  ageButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  ageButtonSelected: {
    backgroundColor: "#FF3366",
    borderColor: "#FF3366",
  },
  ageButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  ageButtonTextSelected: {
    color: "#FFF",
  },
  distanceValue: {
    fontSize: 14,
    color: "#FF3366",
    fontWeight: "600",
  },
  distanceButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  distanceButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    minWidth: 70,
  },
  distanceButtonSelected: {
    backgroundColor: "#FF3366",
    borderColor: "#FF3366",
  },
  distanceButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  distanceButtonTextSelected: {
    color: "#FFF",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4757",
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 15,
    gap: 8,
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 20,
  },
});

export default SettingsScreen;
