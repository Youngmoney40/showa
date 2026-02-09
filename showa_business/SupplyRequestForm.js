import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Image,
  ActivityIndicator,
  Modal,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_ROUTE } from "../api_routing/api";
const { width, height } = Dimensions.get("window");

const categories = [
  "Construction Materials",
  "Electrical Supplies",
  "Plumbing Materials",
  "Office Supplies",
  "Industrial Equipment",
  "Other",
];


const suppliers = [
  { id: 1,image:require('../assets/images/dad.jpg'), name: "ABC Construction " },
  { id: 2, image:require('../assets/images/erewr.png'), name: "XYZ Electricals" },
  { id: 3, image:require('../assets/images/8555e2167169969.Y3JvcCwxMTAzLDg2MiwwLDM2OA.png'), name: "Global Plumbing" },
  { id: 4,image:require('../assets/images/tyyy.png'), name: "Office World" },
  { id: 5,image:require('../assets/images/cta_girl_new.jpeg'), name: "Industrial Solutions" },
  { id: 6,image:require('../assets/images/0_qXhptVIOs6Cvq9WB.jpg'), name: "BuildRight Materials" },
  { id: 7,image:require('../assets/images/woman_laptop.jpg'), name: "Quick Supply Co." },
];

export default function SupplyRequestFormScreen({navigation}) {
  const [activeTab, setActiveTab] = useState("Supply");
  const [category, setCategory] = useState("");
  const [request, setRequest] = useState("");
  const [quantity, setQuantity] = useState("");
  const [timeline, setTimeline] = useState("");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingSuppliers, setSendingSuppliers] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buttonScale] = useState(new Animated.Value(1));
  const [isFocused, setIsFocused] = useState({
    category: false,
    request: false,
    note: false,
    address: false,
  });

  const modalTranslateY = useRef(new Animated.Value(-height)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.7 },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorMessage) {
          console.error("Image Picker Error: ", response.errorMessage);
        } else {
          const asset = response.assets[0];
          setAttachment(asset);
        }
      }
    );
  };

  const animateModalIn = () => {
    Animated.parallel([
      Animated.timing(modalTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateModalOut = () => {
    Animated.parallel([
      Animated.timing(modalTranslateY, {
        toValue: -height,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => setShowSuccessModal(false));
  };

  const startProgressAnimation = () => {
    setProgress(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        animateModalOut();
      }
    });

    progressAnim.addListener(({ value }) => {
      setProgress(value * 100);
    });
  };

  useEffect(() => {
    if (showSuccessModal) {
      animateModalIn();
      startProgressAnimation();
    }
  }, [showSuccessModal]);

  const handleSubmit = async () => {
    if (!category || !request || !note || !address) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("category", category);
    formData.append("title", request);
    formData.append("quantity", quantity);
    formData.append("timeline", timeline);
    formData.append("note", note);
    formData.append("address", address);

    if (attachment) {
      formData.append("attachment", {
        uri: attachment.uri,
        name: attachment.fileName || "photo.jpg",
        type: attachment.type || "image/jpeg",
      });
    }


    try {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
   const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_ROUTE}/request-supply/`, {        
         method: "POST",
          headers: { Authorization: `Bearer ${token}` },
         body: formData,
       });
  
  // Show sending notifications
  setSendingSuppliers(suppliers);

  // Simulate sending to suppliers
  suppliers.forEach((supplier, index) => {
    setTimeout(() => {
      setSendingSuppliers((prev) =>
        prev.filter((s) => s.id !== supplier.id)
      );
    }, 5000 + index * 3000); // ⬅️ stays ~5–8 seconds each
  });

  // Show success modal after all suppliers are "notified"
  setTimeout(() => {
    setShowSuccessModal(true);
    resetForm();
    navigation.goBack();
  }, 5000 + suppliers.length * 3000 + 2000); 




    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

  const resetForm = () => {
    setCategory("");
    setRequest("");
    setQuantity("");
    setTimeline("");
    setNote("");
    setAddress("");
    setAttachment(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Notification Badges */}
     
          {sendingSuppliers.length > 0 && (
        <View style={styles.notificationContainer}>
          {sendingSuppliers.slice(0, 7).map((supplier) => (
            <View key={supplier.id} style={styles.notificationBadge}>
              <Image source={supplier.image} style={{width:50,height:50, borderRadius:50}}/>
              <Text style={styles.notificationText}>
                Sending to 
                {supplier.name}
              </Text>
              <ActivityIndicator size="small" color="#332bc9ff" />
            </View>
          ))}
          {sendingSuppliers.length > 3 && (
            <View style={styles.moreNotificationBadge}>
              <Text style={styles.moreNotificationText}>
                +{sendingSuppliers.length - 3} more
              </Text>
            </View>
          )}
        </View>
      )}
    

      {/* Header */}
      <LinearGradient
        colors={["#0d64dd", "#0d64dd"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={()=>navigation.goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New {activeTab} Request</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Form Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>What do you need?</Text>
            <Text style={styles.subtitle}>
              Provide details to help suppliers understand your requirements
            </Text>
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View
              style={[
                styles.dropdownContainer,
                isFocused.category && styles.inputFocused,
              ]}
            >
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
                dropdownIconColor="#0750b5"
                mode="dropdown"
              >
                <Picker.Item label="Select a category" value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
              {/* <Picker
  selectedValue={category}
  onValueChange={(itemValue) => setCategory(itemValue)}
  style={styles.picker}
  dropdownIconColor="#0750b5"
  mode="dropdown"
>
  <Picker.Item label="Select a category" value="" />
  {categories.map((cat) => (
    <Picker.Item
      key={cat.id}
      label={cat.name}
      value={cat.id}
    />
  ))}
</Picker> */}

            </View>
          </View>

          {/* Request Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Request Title</Text>
            <TextInput
              placeholder="e.g. 'Need 50 bags of cement'"
              placeholderTextColor="#A0AEC0"
              style={[
                styles.inputBox,
                isFocused.request && styles.inputFocused,
              ]}
              value={request}
              onChangeText={setRequest}
              onFocus={() => handleFocus("request")}
              onBlur={() => handleBlur("request")}
            />

            <Text style={[styles.label, { marginTop: 10 }]}>Quantity</Text>
            <TextInput
              placeholder="e.g. 50"
              placeholderTextColor="#A0AEC0"
              style={[
                styles.inputBox,
                isFocused.request && styles.inputFocused,
              ]}
              value={quantity}
              onChangeText={setQuantity}
              onFocus={() => handleFocus("request")}
              onBlur={() => handleBlur("request")}
            />

            <Text style={[styles.label, { marginTop: 10 }]}>
              Requested Dead-line (Optional)
            </Text>
            <TextInput
              placeholder="e.g. 2 weeks"
              placeholderTextColor="#A0AEC0"
              style={[
                styles.inputBox,
                isFocused.request && styles.inputFocused,
              ]}
              value={timeline}
              onChangeText={setTimeline}
              onFocus={() => handleFocus("request")}
              onBlur={() => handleBlur("request")}
            />
          </View>

          {/* Details */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Details</Text>
              <Text style={styles.characterCount}>{note.length}/500</Text>
            </View>
            <View
              style={[
                styles.richTextBox,
                isFocused.note && styles.inputFocused,
              ]}
            >
              <TextInput
                placeholder="Add a clear description..."
                placeholderTextColor="#A0AEC0"
                style={styles.noteInput}
                value={note}
                multiline
                numberOfLines={5}
                maxLength={500}
                onChangeText={setNote}
                onFocus={() => handleFocus("note")}
                onBlur={() => handleBlur("note")}
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Delivery Location</Text>
            <View
              style={[
                styles.locationContainer,
                isFocused.address && styles.inputFocused,
              ]}
            >
              <MaterialIcons
                name="location-on"
                size={20}
                color={isFocused.address ? "#0750b5" : "#718096"}
                style={styles.locationIcon}
              />
              <TextInput
                placeholder="Enter delivery address"
                placeholderTextColor="#A0AEC0"
                style={styles.locationInput}
                value={address}
                onChangeText={setAddress}
                onFocus={() => handleFocus("address")}
                onBlur={() => handleBlur("address")}
              />
            </View>
          </View>

          {/* Attachments */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Attachments (Optional)</Text>
            {attachment && (
              <Image
                source={{ uri: attachment.uri }}
                style={styles.attachmentImage}
              />
            )}
            <TouchableOpacity
              style={styles.attachmentButton}
              onPress={pickImage}
            >
              <MaterialIcons name="add" size={24} color="#0750b5" />
              <Text style={styles.attachmentText}>Add photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: buttonScale }] },
          ]}
        >
          <TouchableOpacity
            style={styles.requestButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            <LinearGradient
              colors={["#0d64dd", "#0d64dd"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator style={{padding:20}} color="#fff" />
              ) : (
                <>
                  <Text style={styles.requestButtonText}>Submit Request</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        transparent={true}
        visible={showSuccessModal}
        animationType="none"
        onRequestClose={animateModalOut}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: modalOpacity },
          ]}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <LinearGradient
                colors={["#0d64dd", "#0d64dd"]}
                style={styles.modalHeaderGradient}
              >
                <Ionicons name="checkmark-done" size={32} color="#fff" />
                <Text style={styles.modalHeaderText}>Request Sent!</Text>
              </LinearGradient>
            </View>

            <View style={styles.modalContent}>
              <Image
                source={require('../assets/images/ok.png')} 
                style={styles.successImage}
              />
              <Text style={styles.successTitle}>Successfully Submitted</Text>
              <Text style={styles.successMessage}>
                Your request has been sent to suppliers. You'll receive quotes soon.
              </Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      { width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      }) }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>Closing in {Math.ceil((100 - progress) / 33)}s</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={animateModalOut}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  notificationContainer: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "flex-start",
  alignItems: "flex-end",
  paddingTop: Platform.OS === "ios" ? 100 : 80,
  paddingHorizontal:20,
  //backgroundColor: "rgba(0, 0, 0, 0.4)", 
  backgroundColor: '#ffffffff', 
  zIndex: 1000,
  
},

  notificationBadge: {
    backgroundColor: "#fff",
    borderRadius: 20,
    maxWidth:'100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#333232ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderColor:'#7d7d80ff',
    borderWidth:0,
    borderStyle:'dotted',
    elevation: 20,
  },
  notificationText: {
    
    fontSize: 17,
    color: "#4A5568",
    padding:10,
    marginRight: 8,
    fontFamily:'Lato-Bold',
    
  },
  moreNotificationBadge: {
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  moreNotificationText: {
    fontSize: 11,
    color: "#4A5568",
    fontWeight: "500",
  },
  header: {
    height: Platform.OS === "ios" ? 100 : 80,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingHorizontal:Platform.OS === 'android'? 20 :0,
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,
  },
  backButton: {
    paddingLeft:20,
      marginBottom:30,
  },
  headerTitle: {
    fontSize: 20,
    marginBottom:30,
    color: "#fff",
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#718096",
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    color: "#4A5568",
    fontWeight: "600",
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 13,
    color: "#A0AEC0",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    color: "#2D3748",
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#2D3748",
    fontSize: 15,
  },
  inputFocused: {
    borderColor: "#0750b5",
    shadowColor: "#0750b5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  richTextBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 140,
  },
  noteInput: {
    flex: 1,
    padding: 16,
    textAlignVertical: "top",
    color: "#2D3748",
    fontSize: 15,
    lineHeight: 22,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  locationIcon: {
    marginRight: 12,
  },
  locationInput: {
    flex: 1,
    color: "#2D3748",
    fontSize: 15,
    padding: 0,
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    borderStyle: "dashed",
  },
  attachmentImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  attachmentText: {
    color: "#0750b5",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 12,
  },
  buttonContainer: {
    marginHorizontal: 0,
    
  },
  requestButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#1106deff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 0,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
    padding:20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    maxHeight: height * 0.8,
  },
  modalHeader: {
    height: 100,
  },
  modalHeaderGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  modalHeaderText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 12,
  },
  modalContent: {
    padding: 25,
    alignItems: "center",
  },
  successImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 8,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "#EDF2F7",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0750b5",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: "#A0AEC0",
    textAlign: "center",
  },
  modalCloseButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  modalCloseText: {
    color: "#0750b5",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

