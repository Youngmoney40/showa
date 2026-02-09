import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const SupplyRequestDetail = ({ navigation, route }) => {

    // const {supplydetail_param} = route.para

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.company}>Essential Ng</Text>
          <Text style={styles.location}>Lagos</Text>
        </View>

        {/* Request */}
        <Text style={styles.requestTitle}>
          Deliver me 200 packs of toilet roll
        </Text>

        {/* Category Tag */}
        <View style={styles.tag}>
          <Text style={styles.tagText}>Fashion</Text>
        </View>

        {/* Posted Info */}
        <Text style={styles.postedText}>Posted 4 days ago</Text>

        {/* Applicants */}
        <TouchableOpacity style={styles.applicantsContainer}>
          <Icon name="people-outline" size={20} color="#555" />
          <Text style={styles.applicantsText}>
            124 Applicants (check Applicants)
          </Text>
          <Icon name="arrow-forward" size={20} color="#555" />
        </TouchableOpacity>

        {/* Further note */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Further note</Text>
          <Text style={styles.noteText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
        </View>

        {/* Retract Button */}
        <TouchableOpacity style={styles.retractButton}>
          <Text style={styles.retractButtonText}>Retract</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  contentContainer: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 8 },
  company: { fontWeight: "bold", fontSize: 16 },
  location: { color: "#555", marginTop: 2 },
  requestTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  tagText: { color: "#333", fontSize: 12 },
  postedText: { color: "#777", fontSize: 12, marginBottom: 16 },
  applicantsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  applicantsText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  noteContainer: { marginBottom: 24 },
  noteTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  noteText: { fontSize: 14, color: "#333", lineHeight: 20 },
  retractButton: {
    backgroundColor: "#dcd0ff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  retractButtonText: {
    color: "#4a00e0",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SupplyRequestDetail;
