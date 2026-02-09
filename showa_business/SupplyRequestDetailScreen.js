import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { API_ROUTE } from "../api_routing/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { API_ROUTE_IMAGE } from "../api_routing/api";

export default function SupplyRequestDetailScreen({ route, navigation }) {
  const { requestId } = route.params;
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState('');

  const fetchRequestDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${API_ROUTE}/supply-requests/${requestId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setRequest(response.data[0]);
      } else if (response.data && !Array.isArray(response.data)) {
        setRequest(response.data);
      } else {
        setError("No request data found");
      }
    } catch (error) {
      console.error("Failed to fetch request detail", error);
      setError("Could not load request details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetail();
  }, [requestId]);

  const handleCallRequester = () => {
    if (request?.requester?.phone) {
      Linking.openURL(`tel:${request.requester.phone}`);
    } else {
      Alert.alert("Error", "Phone number not available");
    }
  };

  const handleChatWithRequester = () => {
    if (request?.requester?.id) {
      navigation.navigate('BPrivateChat', {
        receiverId: request.requester.id,
        name: request.requester.name,
        chatType: 'single',
        profile_image: request.requester.profile_picture 
          ? `${API_ROUTE_IMAGE}${request.requester.profile_picture}`
          : null,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading request details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchRequestDetail}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Request not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.category}>{request.category}</Text>
          <Text style={styles.title}>{request.title}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.date}>
              Posted on {format(new Date(request.created_at), "MMM dd, yyyy")}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </View>

        {/* Requester Info Section */}
        {request.requester && (
          <View style={styles.requesterCard}>
            <Text style={styles.sectionTitle}>Requester Information</Text>
            
            <View style={styles.requesterInfo}>
              {request.requester.profile_picture ? (
                <Image
                  source={{ uri: `${API_ROUTE_IMAGE}${request.requester.profile_picture}` }}
                  style={styles.requesterAvatar}
                />
              ) : (
                <View style={[styles.requesterAvatar, styles.avatarPlaceholder]}>
                  <MaterialIcons name="person" size={24} color="#fff" />
                </View>
              )}
              
              <View style={styles.requesterDetails}>
                <Text style={styles.requesterName}>{request.requester.name}</Text>
                {request.requester.is_verified && (
                  <View style={styles.verifiedBadge}>
                    <MaterialIcons name="verified" size={14} color="#4CAF50" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
                {request.requester.phone && (
                  <Text style={styles.requesterPhone}>{request.requester.phone}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.requesterActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleCallRequester}
              >
                <FontAwesome name="phone" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.chatButton]}
                onPress={handleChatWithRequester}
              >
                <MaterialIcons name="chat" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Image Section */}
        {request.attachment && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `${API_ROUTE_IMAGE}${request.attachment}` }}
              style={styles.attachment}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Details Section */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <MaterialIcons name="shopping-cart" size={20} color={COLORS.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Quantity Needed</Text>
              <Text style={styles.detailValue}>
                {request.quantity || "Not specified"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="schedule" size={20} color={COLORS.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Deadline</Text>
              <Text style={styles.detailValue}>
                {request.timeline || "Flexible"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Delivery Location</Text>
              <Text style={styles.detailValue}>{request.address}</Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Request Details</Text>
          <Text style={styles.descriptionText}>{request.note}</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.respondButton}
          onPress={handleChatWithRequester}
          activeOpacity={0.8}
        >
          <MaterialIcons name="chat" size={22} color="#fff" />
          <Text style={styles.respondButtonText}>Respond to Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Color constants for consistency
const COLORS = {
  primary: "#6C63FF",
  secondary: "#4A44B7",
  background: "#F8F9FA",
  text: "#333333",
  textLight: "#666666",
  border: "#E0E0E0",
  danger: "#FF5252",
  success: "#4CAF50",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textLight,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  errorText: {
    marginTop: 16,
    color: COLORS.text,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
  },
  category: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 34,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  statusBadge: {
    backgroundColor: COLORS.success + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: "600",
  },
  requesterCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  requesterInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  requesterAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  requesterDetails: {
    flex: 1,
  },
  requesterName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 4,
  },
  requesterPhone: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  requesterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  chatButton: {
    backgroundColor: "#4CAF50",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  attachment: {
    width: "100%",
    height: 220,
    backgroundColor: COLORS.border,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  descriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  respondButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  respondButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 10,
  },
});